import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Column} from "typeorm";
import { Character } from "./Character";
import { User } from "./Users";

@Entity()
export class AdoptionStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.adoptionStatus)
    @JoinColumn()
    ownership: User;

    @ManyToOne(() => User, user => user.adoptionStatuses)
    previous_owner: User;

    @OneToOne(() => User, user => user.adoptionStatus)
    @JoinColumn()
    adoptee: User;

    @Column()
    adopt_date: Date;

    @OneToOne(() => Character, character => character.adoptionStatus)
    character: Character;
}
