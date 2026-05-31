/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reporters').del()
  await knex('reporters').insert([
    {id: 1, name: 'John Doe', location: 'New York', city: 'New York', availability: 'Available'},
    {id: 2, name: 'Jane Smith', location: 'Los Angeles', city: 'Los Angeles', availability: 'Unavailable'},
    {id: 3, name: 'Bob Johnson', location: 'Chicago', city: 'Chicago', availability: 'Available'}
  ]);
};
