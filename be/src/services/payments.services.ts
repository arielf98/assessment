import * as JobModel from '../models/payments.model.js';

async function getAllPayments() {
    return JobModel.getAllPayments();
}


export {
    getAllPayments
};