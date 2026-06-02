import * as editorsModel from '../models/editors.model.js';

async function getAllEditors() {
    return editorsModel.getAllEditors();
}

async function getEditorById(id: number) {
    return editorsModel.getEditorById(id);
}

async function createEditor(editor: editorsModel.Editor) {
    return editorsModel.createEditor(editor);
}

async function updateEditor(id: number, editor: editorsModel.Editor) {
    return editorsModel.updateEditor(id, editor);
}

export {
    getAllEditors,
    getEditorById,
    createEditor,
    updateEditor,
};