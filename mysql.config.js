import knex from 'knex';

const database = knex({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST,
        port: 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DBNAME
    },
});

export { database as db };