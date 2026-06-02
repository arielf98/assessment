import * as reportersService from '../services/payments.services.js';
import { type Request, type Response } from 'express';


async function getAllPayments(req: Request, res: Response) {
    try {
        const payments = await reportersService.getAllPayments();
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    getAllPayments
};