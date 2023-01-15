import {Controller, Get, HttpStatus, Post, Request, UseGuards} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {JwtAuthGuard} from "./jwt-auth.guard";

export interface IDentist {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}


@Controller('api/dentists')
export class DentistsController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) {
    }

    // @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req): Promise<IDentist[]> {
        const users = await this.usersRepository.find({
            where: {
                id_permissions: 2
            }
        })
        const dentists = []

        for (const user of users) {
            const dentist = {
                id: user.id,
                firstName: user.name,
                lastName: user.surname,
                pesel: user.pesel,
                email: user.email,
                phone: user.email,
                reservations: []
            }

            const events = await this.eventsRepository.find({where: { id_dent: dentist.id}})
            const reservations = []

            for (const event of events) {
                const user = await this.usersRepository.findOne({where: {id: event.id_user}})
                const reservation = {
                    id: event.id,
                    title: user.email,
                    start: event.start
                }
                reservations.push(reservation)
            }


            dentist.reservations = reservations;
            dentists.push(dentist)
        }


        return dentists

    }
}