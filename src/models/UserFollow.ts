import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './Users';

@Entity('followers')
export class Follower {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.following)
    following: User;

    @ManyToOne(() => User, user => user.followers)
    follower: User;
}
