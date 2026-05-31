import db from '../database/db.js';



function getAllJobs() {
    return db('job').select('*');
}

export {
    getAllJobs,
};