import db from '../database/db.js';


type CreateJobPayload = {
    case_name: string;
    duration: number;
    location: string;
    city: string;
    reporter_id: number;
    editor_id: number;
    reporter_earning?: number;
    editor_earning?: number;
};

type UpdateJobPayload = Partial<{
    case_name: string;
    duration: number;
    location: string;
    city: string;
    status: string;
    reporter_id: number | null;
    editor_id: number | null;
    reporter_earning: number;
    editor_earning: number;
}>;

function getAllJobs() {
    return db('job')
        .leftJoin(
            'reporters',
            'job.reporter_id',
            'reporters.id'
        )
        .leftJoin(
            'editors',
            'job.editor_id',
            'editors.id'
        )
        .select(
            'job.*',
            'reporters.name as reporter_name',
            'editors.name as editor_name',
            'editors.rate as editor_rate'
        );
}

async function createJob(job: CreateJobPayload) {
    const [id] = await db('job').insert({
        case_name: job.case_name,
        duration: job.duration,
        location: job.location,
        city: job.city,
        reporter_id: job.reporter_id,
        editor_id: job.editor_id,
        reporter_earning: job.reporter_earning ?? 0,
        editor_earning: job.editor_earning ?? 0
    });

    return db('job').where({ id }).first();
}

async function getJobById(id: number) {
    try {
        const job = await db('job').where({ id }).first();
        return job;
    } catch (error) {
        console.error(`Error fetching job with id ${id}:`, error);
        throw new Error('Internal Server Error');
    }
}

async function updateJob(id: number, job: UpdateJobPayload) {
    const getJob = await getJobById(id);
    if (!getJob) {
        throw new Error(`Job with id ${id} not found`);
    }
    const allowedFields = ['case_name', 'duration', 'location', 'city', 'status', 'reporter_id', 'editor_id', 'reporter_earning', 'editor_earning'];
    const updateData: any = {};

    for (const field of allowedFields) {
        if (field in job) {
            updateData[field as keyof UpdateJobPayload] = job[field as keyof UpdateJobPayload];
        }
    }
    await db('job').where({ id }).update(updateData);
    return db('job').where({ id }).first();
}

export {
    getAllJobs,
    createJob,
    updateJob
};
