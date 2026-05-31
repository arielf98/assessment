import express from 'express';
import * as JobController from '../controller/job.controller.js';

const router = express.Router();

router.get('/', JobController.getAllJobs);
router.post('/', JobController.createJob);
router.put('/:id', JobController.updateJob);

export default router;  