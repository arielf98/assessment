import express from 'express';
import * as PaymentsController from '../controller/payments.contoller.js';

const router = express.Router();

router.get('/', PaymentsController.getAllPayments);

export default router;  