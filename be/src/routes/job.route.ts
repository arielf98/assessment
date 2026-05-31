import express from 'express';
import * as JobController from '../controller/job.controller.js';

const router = express.Router();

router.get('/', JobController.getAllJobs);
router.post('/', JobController.createJob);

export default router;  