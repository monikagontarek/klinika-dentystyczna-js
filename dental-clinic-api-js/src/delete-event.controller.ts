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
import {Delete} from "@nestjs/common/decorators/http/request-mapping.decorator";



export class DeleteEventRequestBodyDTO {
    id: string;
}

@Controller('delete-event')
export class DeleteEventController {
    constructor(

        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        private jwtService: JwtService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async creatEvent(@Body() deleteEvent: DeleteEventRequestBodyDTO, @Request() req, @Res() response: Response): Promise<any> {
        console.log({
            id: deleteEvent.id,
            id_user: req.user.userId
        })
        try {
            if(req.user.userId){

                const result = await this.eventRepository.delete({
                    id: deleteEvent.id,
                    id_user: req.user.userId
                });


                // DELETE `t_event` WHERE id=@deleteEvent.id AND id_user=@req.user.userId
                response.send(result);
                return
            }
            response.send({message: "Nie jesteś zalogowany jako Administrator"})
            return


        } catch (e) {
            response.status(HttpStatus.BAD_REQUEST).send({message: "Something went wrong"});
            return;
        }
    }
}
