import * as reportersModel from '../models/reporters.model.js';

async function getAllReporters() {
    return reportersModel.getAllReporters();
}

export {
    getAllReporters,
};