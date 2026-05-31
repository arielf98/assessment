import * as JobModel from '../models/job.model.js';


async function getAllJobs() {
    return JobModel.getAllJobs();
}

async function createJob(job: any) {
    return JobModel.createJob(job);
}

export {
    getAllJobs,
    createJob
};