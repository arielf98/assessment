
exports.up = function (knex) {
    return knex.schema.createTable("editors", function (table) {
        table.increments("id").primary();
        table.string("name").notNullable().defaultTo("");
        table.string("location_type").notNullable().defaultTo("");
        table.string("city").notNullable().defaultTo("");
        table.integer("rate").notNullable().defaultTo(0);
        table.string("availability").notNullable().defaultTo("");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

};

exports.down = function (knex) {
    return knex.schema.dropTable("editors");
};
