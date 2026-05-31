/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('editors').del()
  await knex('editors').insert([
    {id: 1, name: 'John Doe', location_type: 'On-site', city: 'New York', availability: 'Available', rate: 100},
    {id: 2, name: 'Jane Smith', location_type: 'Remote', city: 'Los Angeles', availability: 'Unavailable', rate: 150},
    {id: 3, name: 'Bob Johnson', location_type: 'On-site', city: 'Chicago', availability: 'Available', rate: 200}
  ]);
};
