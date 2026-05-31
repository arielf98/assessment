exports.up = async function(knex) {
  await knex.schema.alterTable('job', function(table) {
    table.integer('reporter_earning').notNullable().defaultTo(0);
    table.integer('editor_earning').notNullable().defaultTo(0);
  });

  await knex('job')
    .whereNotNull('reporter_id')
    .update({
      reporter_earning: knex.raw('duration * 2000'),
    });

  await knex.raw(`
    UPDATE job
    SET editor_earning = COALESCE((
      SELECT editors.rate
      FROM editors
      WHERE editors.id = job.editor_id
    ), 0)
    WHERE editor_id IS NOT NULL
  `);
};

exports.down = async function(knex) {
  await knex.schema.alterTable('job', function(table) {
    table.dropColumn('reporter_earning');
    table.dropColumn('editor_earning');
  });
};
