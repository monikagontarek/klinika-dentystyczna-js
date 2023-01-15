import {Body, Controller, HttpStatus, Post, Res, Request, UseGuards} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {Event} from "./event.entity";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {v4 as uuidv4} from "uuid";
import {Response} from "express";



export class NewEventRequestBodyDTO {
    dentistId: string;
    eventStart: string;
}
const generationUuid = (): string => {
    const dbId = uuidv4();
    return dbId;
}

@Controller('/api/create-event')
export class CreatEventController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        private jwtService: JwtService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post() // oczekuj w request body pol z interfejsu LoginRequestBodyDTO
    async creatEvent(@Body() newEvent: NewEventRequestBodyDTO, @Request() req, @Res() response: Response): Promise<any> {

        try {
            const newEventDb = new Event();
            newEventDb.id = generationUuid();
            newEventDb.start = new Date(newEvent.eventStart);
            newEventDb.end = new Date(newEvent.eventStart);
            newEventDb.id_dent = newEvent.dentistId;
            newEventDb.id_user = req.user.userId

            // zapisanie nowego iventu do bazy
            await this.eventRepository.save(newEventDb);
            response.send(newEventDb)
            return
        } catch (e) {
            response.status(HttpStatus.BAD_REQUEST).send({message: "Something went wrong"});
            return;
        }
    }
}
