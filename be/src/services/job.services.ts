import * as JobModel from '../models/job.model.js';


async function getAllJobs() {
    return JobModel.getAllJobs();
}

async function createJob(job: any) {
    return JobModel.createJob(job);
}

async function updateJob(id: number, job: Partial<any>) {
    return JobModel.updateJob(id, job);
}

export {
    getAllJobs,
    createJob,
    updateJob
};