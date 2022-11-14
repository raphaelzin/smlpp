import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Redirect } from "./Redirect";

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  url: string;

  @Column()
  short: string;

  @OneToMany((type) => Redirect, (redirect) => redirect.link)
  redirects: Redirect[];
}
