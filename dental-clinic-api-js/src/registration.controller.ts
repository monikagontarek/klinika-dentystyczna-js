import {Controller, Body, Post, Res, HttpStatus} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Column, Repository} from "typeorm";
import {Event} from "./event.entity";
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from 'bcrypt';
import {Response} from "express";


export class RegistrationRequestBodyDTO {
    firstName: string;
    lastName: string;
    pesel: string;
    mail: string;
    phone: string;
    password: string;

}

let id_permissions: number;
const admin: string = "@admin.pl";
const dentist: string = "@denti.pl";

const generationUuid = (): string => {
    const dbId = uuidv4();
    return dbId;
}

const hashPassword = async (password: string): Promise<string> => {
    const dbPassword = await bcrypt.hash(password, 10);
    return dbPassword
}

@Controller('/api/registration')
export class RegistrationController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) {
    }

    @Post()
    async registration(@Body() registrationRequestBodyDTO: RegistrationRequestBodyDTO, @Res() response: Response): Promise<any> {
        // const dbUserExistEmail = this.usersRepository.findOne({where: {email: registrationRequestBodyDTO.mail}})
        // if (dbUserExistEmail) {
        //     response.status(403).send({message: "User with such email already exists"});
        //     return;
        // }


        try {
            const userDB = new User();
            userDB.id = generationUuid();
            userDB.name = registrationRequestBodyDTO.firstName;
            userDB.surname = registrationRequestBodyDTO.lastName;
            userDB.pesel = registrationRequestBodyDTO.pesel;
            userDB.email = registrationRequestBodyDTO.mail;
            userDB.phone = registrationRequestBodyDTO.phone;
            userDB.password = await hashPassword(registrationRequestBodyDTO.password);

            if (registrationRequestBodyDTO.mail.endsWith(`${admin}`)) {
                userDB.id_permissions = 1;
            } else if (registrationRequestBodyDTO.mail.endsWith(`${dentist}`)) {
                userDB.id_permissions = 2;
            } else {
                userDB.id_permissions = 3;
            }

            await this.usersRepository.save(userDB);
            return userDB
        } catch (e) {
            response.status(HttpStatus.BAD_REQUEST).send({message: "Something went wrong"});
            return;
        }

    }
}