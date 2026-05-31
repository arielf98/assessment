/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reporters').del()
  await knex('reporters').insert([
    {id: 1, name: 'John Doe', location_type: 'On-site', city: 'New York', availability: 'Available'},
    {id: 2, name: 'Jane Smith', location_type: 'Remote', city: 'Los Angeles', availability: 'Unavailable'},
    {id: 3, name: 'Bob Johnson', location_type: 'On-site', city: 'Chicago', availability: 'Available'}
  ]);
};
