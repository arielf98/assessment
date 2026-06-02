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

async function createReporter(req: Request, res: Response) {
    const reporterData = req.body;
    try {
        const newReporterId = await reportersService.createReporter(reporterData);
        res.status(201).json({ id: newReporterId });
    } catch (error) {
        console.error('Error creating reporter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateReporter(req: Request, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const reporterData = req.body;
    try {
        const updatedReporter = await reportersService.updateReporter(id, reporterData);
        if (updatedReporter) {
            res.json(updatedReporter);
        } else {
            res.status(404).json({ error: 'Reporter not found' });
        }
    } catch (error) {
        console.error(`Error updating reporter with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    getAllReporters,
    getReporterByCity,
    createReporter,
    updateReporter

};