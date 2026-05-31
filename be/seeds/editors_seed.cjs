/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('editors').del()
  await knex('editors').insert([
    {id: 1, name: 'John Doe', location: 'New York', city: 'New York', availability: 'Available', rate: 100},
    {id: 2, name: 'Jane Smith', location: 'Los Angeles', city: 'Los Angeles', availability: 'Unavailable', rate: 150},
    {id: 3, name: 'Bob Johnson', location: 'Chicago', city: 'Chicago', availability: 'Available', rate: 200}
  ]);
};
