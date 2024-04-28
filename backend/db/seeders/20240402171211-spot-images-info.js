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
        url: "/erabnb-greeceint.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/erabnb-greecebath.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/erabnb-greecekitchen.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/erabnb-greecemarket.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/erabnb-victorianext.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "/erabnb-victorianfoyer.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/erabnb-victoriandining.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/erabnb-victorianbath.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/erabnb-victorianbed.jpg",
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
        url: "/erabnb-futureext.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "/erabnb-futuredining.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "/erabnb-futurebath.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "/erabnb-futurebed.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "/erabnb-futurevieww.jpg",
        preview: false,
      },
      // {
      //   spotId: 6,
      //   url: "/erabnb-moonext.jpg",
      //   preview: true,
      // },
      // {
      //   spotId: 6,
      //   url: "/erabnb-moondining.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 6,
      //   url: "/erabnb-moonbath.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 6,
      //   url: "/erabnb-moonview.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 6,
      //   url: "/erabnb-moonbed.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 7,
      //   url: "/erabnb-medievalext.jpg",
      //   preview: true,
      // },
      // {
      //   spotId: 7,
      //   url: "/erabnb-medievalview.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 7,
      //   url: "/erabnb-medievalbath.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 7,
      //   url: "/erabnb-medievalbed.jpg",
      //   preview: false,
      // },
      // {
      //   spotId: 7,
      //   url: "/erabnb-medievaldining.jpg",
      //   preview: false,
      // },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
