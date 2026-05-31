import * as JobModel from '../models/job.model.js';


async function getAllJobs() {
    return JobModel.getAllJobs();
}

export {
    getAllJobs,
};