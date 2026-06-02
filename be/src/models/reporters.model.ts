import db from '../database/db.js';

type Reporter = {
    name: string;
    city: string;
    location_type?: string;
};

function getAllReporters() {
    return db('reporters').select('*');
}

async function getReporterByCity(city: string) {
    const reporter = await db('reporters').where({ city }).first();
    return reporter;
}

async function createReporter(reporter: Reporter) {
    const [id] = await db('reporters').insert(reporter).returning(['id', 'name', 'city', 'location_type', 'created_at', 'availability']);
    return id;
}

async function updateReporter(id: number, reporter: Partial<Reporter>) {
    return await db('reporters').where({ id }).update(reporter).returning(['id', 'name', 'city', 'location_type', 'created_at', 'availability']);
}   

export {
    getAllReporters,
    getReporterByCity,
    createReporter,
    updateReporter,
    type Reporter
};