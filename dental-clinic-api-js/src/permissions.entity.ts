import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity("t_permissions")
export class Permissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    add_user: number;

    @Column()
    rm_user: number;

    @Column()
    add_event: number;

    @Column()
    rm_event: number;

    @Column()
    edit_user: number;

    @Column()
    edit_event: number;
}