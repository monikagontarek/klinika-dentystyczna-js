import {Controller, Body, Request, UseGuards, HttpStatus, Res} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Put} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {v4 as uuidv4} from "uuid";
import * as bcrypt from "bcrypt";
import {Response} from "express";

export class UpdateDentiDTO {
    firstName: string;
    id: string;
    lastName: string;
    pesel: string = "";
    email: string;
    phone: string = "";
    password?: string;
}

const generationUuid = (): string => {
    const dbId = uuidv4();
    return dbId;
}

const hashPassword = async (password: string): Promise<string> => {
    const dbPassword = await bcrypt.hash(password, 10);
    return dbPassword
}


@Controller('/api/dentist-update-admin')
export class DentistsUpdateAdminController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateDenti(@Body() updateDenti: UpdateDentiDTO, @Request() req, @Res() response: Response): Promise<any> {

        // należy przekazać rezerwacje ??

        console.log("req.user.id_permissions", req.user.id_permissions)
        try {
            if (req.user.id_permissions == 1) {
                const dentiDB = new User();
                dentiDB.id = updateDenti.id;
                dentiDB.name = updateDenti.firstName;
                dentiDB.surname = updateDenti.lastName;
                dentiDB.pesel = updateDenti.pesel;
                dentiDB.email = updateDenti.email;
                dentiDB.phone = updateDenti.phone;
                if(updateDenti.password) {
                    dentiDB.password = await hashPassword(updateDenti.password);
                }
                dentiDB.id_permissions = 2;

                await this.usersRepository.update(dentiDB.id, dentiDB);
                response.send(dentiDB)
                return;
            }

            response.send({message: "Nie jesteś zalogowany jako Administrator"})
            return

        } catch (e) {
            console.error("e", e)
            response.status(HttpStatus.BAD_REQUEST).send({message: "Something went wrong"});
            return;
        }
    }
}