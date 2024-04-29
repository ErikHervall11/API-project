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
        spotId: 2,
        userId: 1,
        review:
          "Not a big fan of pillars. Not terrible though. The produce right outside was convenient",
        stars: 2,
      },
      {
        spotId: 3,
        userId: 1,
        review: "Gorgeous home. Very elegant.",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 2,
        review: "Cozy home. A great way to get away.",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 2,
        review: "So much nicer than my dirty NYC apartment.",
        stars: 4,
      },
      {
        spotId: 6,
        userId: 3,
        review:
          "What an experience. Now, back on Earth, I still feel like I'm floating!",
        stars: 5,
      },
      {
        spotId: 5,
        userId: 3,
        review:
          "I was expecting more robots in the future, but the view was amazing and the cars were really fast!",
        stars: 4,
      },
      {
        spotId: 1,
        userId: 4,
        review: "I was almost eaten by a Velociraptor. Will NOT book again!",
        stars: 1,
      },
      {
        spotId: 6,
        userId: 4,
        review:
          "Who would have thought they went to the moon to build this! I had no idea!",
        stars: 5,
      },
      {
        spotId: 4,
        userId: 5,
        review: "Great cocktails. Just stay away from the bathtub gin...",
        stars: 3,
      },
      {
        spotId: 1,
        userId: 5,
        review: "Tyrannosaurus, Triceratops, and Brontosaurus, OH MY!",
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
