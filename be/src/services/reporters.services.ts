import * as reportersModel from '../models/reporters.model.js';

async function getAllReporters() {
    return reportersModel.getAllReporters();
}

async function getReporterByCity(city: string) {
    return reportersModel.getReporterByCity(city);
}

async function createReporter(reporter: reportersModel.Reporter) {
    return reportersModel.createReporter(reporter);
}

async function updateReporter(id: number, reporter: Partial<reportersModel.Reporter>) {
    return reportersModel.updateReporter(id, reporter);
}   

export {
    getAllReporters,
    getReporterByCity,
    createReporter,
    updateReporter
};