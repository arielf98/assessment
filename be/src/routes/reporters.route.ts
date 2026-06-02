import express from 'express';
import * as ReportersController from '../controller/reporters.controller.js';

const router = express.Router();

router.put('/:id', ReportersController.updateReporter);
router.get('/', ReportersController.getAllReporters);
router.post('/', ReportersController.createReporter);
router.get('/location', ReportersController.getReporterByCity);

export default router;