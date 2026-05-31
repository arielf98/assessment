import * as reportersModel from '../models/reporters.model.js';

async function getAllReporters() {
    return reportersModel.getAllReporters();
}

async function getReporterByCity(city: string) {
    return reportersModel.getReporterByCity(city);
}

export {
    getAllReporters,
    getReporterByCity
};