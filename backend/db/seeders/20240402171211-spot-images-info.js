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
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "/erabnb-jurassic.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "/erabnb-jurassicporch.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/erabnb-jurassicbathroom.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/erabnb-jurassicint.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/erabnb-jurassicbackyard.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/erabnb-ancientgreece.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "image url",
        preview: false,
      },
      {
        spotId: 2,
        url: "image url",
        preview: false,
      },
      {
        spotId: 2,
        url: "image url",
        preview: false,
      },
      {
        spotId: 2,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "/erabnb-victorian.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 4,
        url: "/erabnb-speakeasybed.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "/erabnb-speakeasy.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/erabnb-speakeasybath.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/erabnb-speakeasybasement.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/erabnb-speakeasyext.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "/erabnb-future.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
