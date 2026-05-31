import db from '../database/db.js';

function getAllReporters() {
    return db('reporters').select('*');
}

export {
    getAllReporters,
};