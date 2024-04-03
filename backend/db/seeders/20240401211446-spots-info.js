"use strict";

const {
  User,
  SpotImage,
  Spot,
  Booking,
  Review,
  ReviewImage,
} = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
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
    ]);
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
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
