import * as editorsModel from '../models/editors.model.js';

async function getAllEditors() {
    return editorsModel.getAllEditors();
}

export {
    getAllEditors,
};