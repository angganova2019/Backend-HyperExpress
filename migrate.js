import { dbactivity } from "./handlerActivity.js";
import { dbtodo } from "./handlerTodo.js";
import { db } from './mysql.config.js';

const STANDBY_TIME = 1000; // 1 sec
const RETRY = 240; // Retry 4 minutes


const test = async () => {
    let haveFound = false;
    let i = 0;
    while (i < RETRY && !haveFound) {

        // Check the database
        haveFound = await checkDb();
        // If no record found, increment the loop count
        i++
    }
}

const checkDb = () => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            let record = null;
            try {
                await db.authenticate();
                console.log('Connection has been established successfully.');
                dbactivity.sync({ force: true });
                dbtodo.sync({ force: true });
                record = true
            } catch (error) {
                record = null;
            }
            // Check whether you've found or not the record
            if (record) return resolve(true);
            resolve(false);

        }, STANDBY_TIME);
    });
}

export const migratedb = test();