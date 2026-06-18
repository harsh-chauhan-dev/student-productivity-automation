import pool from './config/db_config.js';

async function test() {
    const result = await pool.query('SELECT NOW()');
    console.log(result);
}
test();