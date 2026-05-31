import { type Request, type Response } from 'express';
import * as EditorsService from '../services/editors.services.js';

async function getAllEditors(req: Request, res: Response) {
    try {
        const editors = await EditorsService.getAllEditors();
        res.json({ success: true, data: editors });
    } catch (error) {
        console.error('Error fetching editors:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export {
    getAllEditors,
};