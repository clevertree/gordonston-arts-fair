import {initDatabase} from '@util/models';
import {Sequelize} from "sequelize-typescript";

// Initialize database connection on the first import
let dbInitialized: Sequelize | undefined;

export async function ensureDatabase() {
    if (!dbInitialized) {
        dbInitialized = await initDatabase();
    }
    return dbInitialized;
}
