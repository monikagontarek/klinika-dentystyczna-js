
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("t_users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    pesel: string;


    @Column()
    email: string;


    @Column()
    phone: string;


    @Column()
    password: string;


    @Column()
    id_permissions: number;
}