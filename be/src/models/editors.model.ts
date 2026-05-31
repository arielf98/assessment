import db from '../database/db.js';

function getAllEditors() {
    return db('editors').select('*');
}

export {
    getAllEditors,
};