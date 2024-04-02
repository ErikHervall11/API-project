"use strict";

const {
  User,
  Session,
  Spot,
  Booking,
  Review,
  ReviewImage,
} = require("../../db/models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate({
      Spots: [
        {
          id: 1,
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
        },
        {
          id: 2,
          ownerId: 2,
          address: "123 Erik Street",
          city: "Seattle",
          state: "Washington",
          country: "United States of America",
          lat: 40.7645358,
          lng: -170.4730327,
          name: "App Academy",
          description: "Place to go hard in the paint",
          price: 123,
        },
        {
          id: 3,
          ownerId: 3,
          address: "123 Four Road",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 80.7645358,
          lng: -40.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
        },
      ],
    });
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
