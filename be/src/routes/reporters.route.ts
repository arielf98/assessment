import express from 'express';
import * as ReportersController from '../controller/reporters.controller.js';

const router = express.Router();

router.get('/', ReportersController.getAllReporters);

export default router;