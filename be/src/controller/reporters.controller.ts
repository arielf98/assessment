import * as reportersService from '../services/reporters.services.js';
import { type Request, type Response } from 'express';

async function getAllReporters(req: Request, res: Response) {
    try {
        const reporters = await reportersService.getAllReporters();
        res.json(reporters);
    } catch (error) {
        console.error('Error fetching reporters:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    getAllReporters,
};