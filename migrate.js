import { default as knex } from "knex";
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
            // db.raw("SELECT 1").then(()=>{
            //     console.log('Connection has been established successfully.');
            //     db.migrate.latest().then(()=>{
            //         record = true;
            //     });
            // }).catch((e)=>{
            //     record = null;
            // })
            try {
                await db.raw("SELECT 1");
                console.log('Connection has been established successfully.');
                await db.migrate.latest();
                record = true;
            } catch (error) {
                record = null;
                console.log("Database not connected");
            }


            // Check whether you've found or not the record
            if (record) return resolve(true);
            resolve(false);

        }, STANDBY_TIME);
    });
};

export const migratedb = test();