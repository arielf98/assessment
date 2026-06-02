import db from '../database/db.js';

type Editor = {
    id: number;
    name: string;
    location_type: string;
    city: string;
    rate: number;
    availability: string;

};

function getAllEditors() {
    return db('editors').select('*');
}

async function getEditorById(id: number) {
    const editor = await db('editors').where({ id }).first();
    return editor;
}

async function createEditor(editor: Editor) {
    const [createdEditor] = await db('editors').insert(editor).returning('*');
    return createdEditor;
}

async function updateEditor(id: number, editor: Editor) {
    const [updatedEditor] = await db('editors').where({ id }).update(editor).returning('*');
    return updatedEditor;
}

export {
    getAllEditors,
    getEditorById,
    createEditor,
    updateEditor,
    type Editor,
};