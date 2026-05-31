
exports.up = function(knex) {
  return knex.schema.createTable('reporters', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.string('location_type').notNullable().defaultTo('');
    table.string('city').notNullable().defaultTo('');
    table.string('availability').notNullable().defaultTo('');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reporters');
};
