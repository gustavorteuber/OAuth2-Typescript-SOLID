import { type IDatabase } from '../interfaces/IDatabase';
import mysql, { type Connection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export class MysqlDatabaseAdapter implements IDatabase {
  private connection?: Connection;

  async connect (): Promise<void> {
    const databaseConfig = {
      host: process.env.DB_HOST_DEV,
      user: process.env.DB_USERNAME_DEV,
      password: process.env.DB_PASSWORD_DEV,
      database: process.env.DB_NAME_DEV
    };
    this.connection = await mysql.createConnection(databaseConfig)
      .catch((e) => {
        console.log(e);
        console.log(databaseConfig);
        throw new Error('Não foi possível estabelecer uma conexão com o banco de dados.');
      });
  }

  async disconnect (): Promise<void> {
    if (this.connection != null) {
      await this.connection.end();
    }
  }

  async query (sql: string, params?: any[]): Promise<any> {
    if (this.connection != null) {
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    }
  }
}
