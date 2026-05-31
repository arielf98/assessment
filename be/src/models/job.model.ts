import db from '../database/db.js';


type CreateJobPayload = {
    case_name: string;
    duration: number;
    location: string;
    city: string;
    reporter_id: number;
    editor_id: number;
};

function getAllJobs() {
    return db('job').select('*');
}

async function createJob(job: CreateJobPayload) {
    const [id] = await db('job').insert({
        case_name: job.case_name,
        duration: job.duration,
        location: job.location,
        city: job.city,
        reporter_id: job.reporter_id,
        editor_id: job.editor_id
    });

    return db('job').where({ id }).first();
}

export {
    getAllJobs,
    createJob
};