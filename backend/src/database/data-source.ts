import { Link } from "./entity/Link";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { LinkRefactor1668201180972 } from "./migration/1668201180972-LinkRefactor";

dotenv.config({ path: __dirname + "/../config/.env" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? ""),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [Link],
  subscribers: [],
  migrations: [LinkRefactor1668201180972],
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(`error! ${error}`));
