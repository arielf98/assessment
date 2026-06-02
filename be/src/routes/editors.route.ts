import * as EditorsController from '../controller/editors.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', EditorsController.getAllEditors);
router.get('/:id', EditorsController.getEditorById);
router.post('/', EditorsController.createEditor);
router.put('/:id', EditorsController.updateEditor);

export default router;