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

async function createJob(req: Request, res: Response) {
    try {
        const jobData = req.body;
        const newJob = await JobService.createJob(jobData);
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export {
    getAllJobs,
    createJob
};