import {Controller, Body, Request, UseGuards, Post, HttpStatus, Res} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Delete} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {v4 as uuidv4} from "uuid";
import * as bcrypt from "bcrypt";
import {Response} from "express";

export class AddDentiDTO {
    firstName: string;
    lastName: string;
    pesel: string = "";
    email: string;
    phone: string = "";
    password: string;
}

const generationUuid = (): string => {
    const dbId = uuidv4();
    return dbId;
}

const hashPassword = async (password: string): Promise<string> => {
    const dbPassword = await bcrypt.hash(password, 10);
    return dbPassword
}


@Controller('/api/dentist-add-admin')
export class DentistsAddAdminController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addDenti(@Body() addDenti: AddDentiDTO, @Request() req, @Res() response: Response): Promise<any> {

        // należy przekazać rezerwacje ??


        try {
            if (req.user.id_permissions == 1) {
                const dentiDB = new User();
                dentiDB.id = generationUuid();
                dentiDB.name = addDenti.firstName;
                dentiDB.surname = addDenti.lastName;
                dentiDB.pesel = addDenti.pesel;
                dentiDB.email = addDenti.email;
                dentiDB.phone = addDenti.phone;
                dentiDB.password = await hashPassword(addDenti.password);
                dentiDB.id_permissions = 2;

                await this.usersRepository.save(dentiDB);
                response.send(dentiDB)
                return;
            }

            response.send({message: "Nie jesteś zalogowany jako Administrator"})
            return

        } catch (e) {
            response.status(HttpStatus.BAD_REQUEST).send({message: "Something went wrong"});
            return;
        }
    }
}