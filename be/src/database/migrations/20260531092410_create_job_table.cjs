
exports.up = function(knex) {
  return knex.schema.createTable('job', function(table) {
    table.increments('id').primary();
    table.string('case_name').notNullable().defaultTo('');
    table.integer('duration').notNullable().defaultTo(0);
    table.string('location').notNullable().defaultTo('');
    table.string("status").notNullable().defaultTo("New");
    table.string('city').notNullable().defaultTo('');
    table.integer("reporter_id").references("id").inTable("reporters");
    table.integer("editor_id").references("id").inTable("editors");
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('job');
};
