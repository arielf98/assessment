import db from '../database/db.js';

async function getAllPayments() {
    // Hitung total per editor langsung di database
    const editors = await db('editors')
        .select(
            "editors.id",
            "editors.name"
        )
        .sum("job.editor_earning as total_earning")
        .join("job", "editors.id", "job.editor_id")
        .groupBy("editors.id", "editors.name"); 

    const reporters = await db('reporters')
        .select(
            "reporters.id",
            "reporters.name"
        )
        .sum("job.reporter_earning as total_earning") 
        .join("job", "reporters.id", "job.reporter_id")
        .groupBy("reporters.id", "reporters.name");

    return [
        ...editors.map(e => ({ ...e, total_earning: Number(e.total_earning), role: 'editor' })),
        ...reporters.map(r => ({ ...r, total_earning: Number(r.total_earning), role: 'reporter' }))
    ];
}


async function getPaymentById(id: number) {
    const payment = await db('job').where({ id }).first();
    return payment;
}

export {
    getAllPayments,
    getPaymentById
};