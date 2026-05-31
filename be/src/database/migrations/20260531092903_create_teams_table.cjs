
exports.up = function (knex) {
    return knex.schema.createTable("teams", function (table) {
        table.increments("id").primary();
        table.string("name").notNullable().defaultTo("");
        table.string("role").notNullable().defaultTo("");
        table.string("location").notNullable().defaultTo("");
        table.string("city").notNullable().defaultTo("");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("teams");
};
