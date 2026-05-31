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

async function getReporterByCity(req: Request, res: Response) {
    const city = req.query.city as string;
    try {
        const reporter = await reportersService.getReporterByCity(city);
        if (reporter) {
            res.json(reporter);
        } else {
            res.status(404).json({ error: 'Reporter not found' });
        }
    } catch (error) {
        console.error(`Error fetching reporter for city ${city}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    getAllReporters,
    getReporterByCity
};