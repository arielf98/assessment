import { type Request, type Response } from 'express';
import * as JobService from '../services/job.services.js';

async function getAllJobs(req: Request, res: Response) {
    try {
        const jobs = await JobService.getAllJobs();
        res.json({ success: true, data: jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export {
    getAllJobs,
};