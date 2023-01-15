import {Body, Controller, Post, Req} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



export class LoginRequestBodyDTO {
    email: string;
    password: string;
}


// analogiczna metoda porownujaca jak w php niezahashowane haslo uzytkownika z hashem z bazy danych
const passwordVerify = async (password: string, hash: string) => {
    const dbPassword = hash.replace('$2y$', '$2a$')
    return await bcrypt.compare(password, dbPassword)
}

@Controller('/api/login')
export class LoginController {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {
    }


    // typ post
    @Post() // oczekuj w request body pol z interfejsu LoginRequestBodyDTO

    async login(@Body() loginRequestBodyDTO: LoginRequestBodyDTO): Promise<any> {

        // const userDB = new User();
        // userDB.email = loginRequestBodyDTO.email;
        // userDB.password = loginRequestBodyDTO.password;
        //
        // await this.usersRepository.save(userDB)
        // znajdz uzytkownika w bazie danych za pomoca email z request body
        const user = await this.usersRepository.findOne({
            where: {
                email: loginRequestBodyDTO.email
            }
        })

        // jezeli nie znalazl uzytkownika
        if (!user) {
            return {
                errorMessage: 'invalid username or password'
            }
        }

        // sprawdz haslo przeslane w request body z zahashowanym haslem uzytkownika w bazie danych
        const isValid = await passwordVerify(loginRequestBodyDTO.password, user.password);
        if (isValid) {
            // jezeli podano poprawne haslo zwroc uzytkownika

            const payload = { username: user.email, sub: user.id, id_permissions: user.id_permissions };
            const token = this.jwtService.sign(payload)
            return {...user, token};
        } else {
            // jezeli nie poprawne
            return {
                errorMessage: 'invalid2 username or password'
            }
        }
    }

}
