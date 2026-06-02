import express from 'express'
import jobRoutes from './job.route.js';
import editorsRoutes from './editors.route.js';
import reportersRoutes from './reporters.route.js';
import paymentsRoutes from './payments.route.js';

const router = express.Router();

router.use('/jobs', jobRoutes);
router.use("/editors", editorsRoutes);
router.use("/reporters", reportersRoutes);
router.use("/payments", paymentsRoutes);

export default router;