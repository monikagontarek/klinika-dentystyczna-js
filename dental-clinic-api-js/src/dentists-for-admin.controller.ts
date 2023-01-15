import {Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {JwtAuthGuard} from "./jwt-auth.guard";

export interface IDentistForAdmin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    pesel : string;
    phone: string;
}


@Controller('/api/dentist-for-admin')
export class DentistsForAdminController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req): Promise<IDentistForAdmin[]> {
        console.log("req.user", req.user)
        const dentists = await this.usersRepository.find({
            where: {
                id_permissions: 2
            }
        })



        const dentistsMapped = dentists.map(dentist => {
            let newDentistMap: IDentistForAdmin = {
                id: dentist.id,
                firstName: dentist.name,
                lastName: dentist.surname,
                pesel: dentist.pesel,
                email: dentist.email,
                phone: dentist.email,
            }
            return newDentistMap
        })

        return dentistsMapped;

    }
}