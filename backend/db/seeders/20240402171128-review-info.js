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
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "Great place!",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 3,
        review: "Love the view!",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Great place!",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 3,
        review: "Love the view!",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 2,
        review: "Great place!",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 3,
        review: "Love the view!",
        stars: 4,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
