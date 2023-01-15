import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DentistsController} from "./dentists.controller";
import {LoginController} from "./login.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UsersService} from "./users.service";
import {UsersModule} from "./users.module";
import {Event} from "./event.entity";
import {RegistrationController} from "./registration.controller";
import { PassportModule } from '@nestjs/passport';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {JwtStrategy} from "./jwt.strategy";
import {CreatEventController} from "./create-event.controller";
import {DentistsForAdminController} from "./dentists-for-admin.controller";
import {DentistsDeleteAdminController} from "./dentists-delete-admin.controller";
import {DentistsAddAdminController} from "./dentists-add-admin.controller";
import {DentistsUpdateAdminController} from "./dentists-update-admin.controller";
import {DeleteEventController} from "./delete-event.controller";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'id16963265_denti',
    entities: [User, Event],
    synchronize: false,
  }),
    UsersModule,
    TypeOrmModule.forFeature([Event]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '360060s' },
    })
  ],
  controllers: [AppController, DentistsController, LoginController, RegistrationController, CreatEventController, DentistsForAdminController, DentistsDeleteAdminController, DentistsAddAdminController, DentistsUpdateAdminController, DeleteEventController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
