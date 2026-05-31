import db from '../database/db.js';

function getAllReporters() {
    return db('reporters').select('*');
}

async function getReporterByCity(city: string) {
    const reporter = await db('reporters').where({ city }).first();
    return reporter;
}

export {
    getAllReporters,
    getReporterByCity
};