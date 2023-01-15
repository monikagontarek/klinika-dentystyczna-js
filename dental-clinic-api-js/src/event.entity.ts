
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("t_event")
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    id_dent: string;

    @Column()
    id_user: string;

    @Column({name: "data_start", type: 'timestamp'})
    start: Date

    @Column({name: "data_end", type: 'timestamp'})
    end: Date
}
