import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    make: string;

    @Column()
    model: string;    

    @Column()
    year: number;

    @Column()
    long: number;

    @Column()
    lat: number;

    @Column()
    mileage: number;

    @Column({ default: false })
    approved: boolean;

    @ManyToOne(() => User, (user) => user.reports)
    user: User  
}