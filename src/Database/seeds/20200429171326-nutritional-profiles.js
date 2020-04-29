'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'nutritional_profiles',
      [
        {
          name: 'Low carb',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'High protein',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'For diabetics',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Zero gluten',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Zero lactose',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Vegeratian',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Vegan',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('nutritional_profiles', null, {});
  },
};
