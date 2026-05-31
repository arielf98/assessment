import express from 'express';
import * as JobController from '../controller/job.controller.js';

const router = express.Router();

router.get('/', JobController.getAllJobs);

export default router;  