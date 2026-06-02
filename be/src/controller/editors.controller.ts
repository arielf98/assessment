import { type Request, type Response } from 'express';
import * as EditorsService from '../services/editors.services.js';

async function getAllEditors(req: Request, res: Response) {
    try {
        const editors = await EditorsService.getAllEditors();
        res.json({ success: true, data: editors });
    } catch (error) {
        console.error('Error fetching editors:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function getEditorById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const editor = await EditorsService.getEditorById(Number(id));
        if (editor) {
            res.json({ success: true, data: editor });
        } else {
            res.status(404).json({ success: false, error: 'Editor not found' });
        }
    } catch (error) {
        console.error(`Error fetching editor with id ${id}:`, error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function createEditor(req: Request, res: Response) {
    const editorData = req.body;
    try {
        const newEditor = await EditorsService.createEditor(editorData);
        res.status(201).json({ success: true, data: newEditor });
    } catch (error) {
        console.error('Error creating editor:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function updateEditor(req: Request, res: Response) {
    const { id } = req.params;
    const editorData = req.body;
    try {
        const updatedEditor = await EditorsService.updateEditor(Number(id), editorData);
        if (updatedEditor) {
            res.json({ success: true, data: updatedEditor });
        } else {
            res.status(404).json({ success: false, error: 'Editor not found' });
        }
    } catch (error) {
        console.error(`Error updating editor with id ${id}:`, error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export {
    getAllEditors,
    getEditorById,
    createEditor,
    updateEditor
};