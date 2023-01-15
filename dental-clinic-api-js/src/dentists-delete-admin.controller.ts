import {Controller, Body, Request, UseGuards} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Delete} from "@nestjs/common/decorators/http/request-mapping.decorator";

export class DeleteDentiDTO {
    id: string;
}


@Controller('api/dentist-delete-admin')
export class DentistsDeleteAdminController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteDenti(@Body() deleteDenti: DeleteDentiDTO, @Request() req): Promise<any> {
        console.log("req.user", req.user)
        console.log("deleteDenti", deleteDenti)
        const deletedDenti = await this.usersRepository.delete(deleteDenti.id)

        return deletedDenti

    }
}