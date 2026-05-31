import * as EditorsController from '../controller/editors.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', EditorsController.getAllEditors);

export default router;