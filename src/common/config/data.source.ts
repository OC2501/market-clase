import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


export const DataSourceConfig: DataSourceOptions = {

        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: +process.env.DB_PORT || 5432,
        username: process.env.POSTGRES_USER || 'umarket',
        password: process.env.POSTGRES_PASSWORD || 'secret123456',
        database: process.env.POSTGRES_DB || 'market',
        entities: [__dirname + './../../**/**/*.entity{.ts,.js}'],
        migrations: [__dirname + './../../migrations/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: true,
        logging: false,
        namingStrategy: new SnakeNamingStrategy(),

}

export const AppDS = new DataSource(DataSourceConfig)