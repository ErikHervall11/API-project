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
        ownerId: 1,
        address: "1 Asteroid Ave",
        city: "Jurassic Junction",
        state: "Pangaea",
        country: "Earth",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Carnivore Cabin",
        description:
          "Escape to a one-of-a-kind getaway with our rustic cabin nestled in the heart of a breathtaking Jurassic landscape. We provide primitive yet comfortable amenities, spectacular views, and a private backyard.",
        price: 185000000,
      },
      {
        ownerId: 2,
        address: " 24 Athena Street",
        city: "Athens",
        state: "Attica",
        country: "Greece",
        lat: 40.7645358,
        lng: -170.4730327,
        name: "Athena's Retreat",
        description:
          "Experience the enchantment of classical Greece in our beautifully preserved residence. This home features traditional Greek architecture with stone walls and terracotta roofs, providing a cool retreat from the Mediterranean sun.",
        price: 1175,
      },
      {
        ownerId: 3,
        address: "27 Regency Square",
        city: "York",
        state: "North Yorkshire",
        country: "England",
        lat: 80.7645358,
        lng: -40.4730327,
        name: "The Crown Jewel Manor",
        description:
          "It is with utmost respect and pride that I present to you the opportunity to reside within our most grand and splendid Victorian domicile, situated in the most picturesque locale of our glorious United Kingdom.",
        price: 1885,
      },
      {
        ownerId: 4,
        address: "Charleston Ave",
        city: "Chicago",
        state: "Illinois",
        country: "United States of America",
        lat: 81.7645358,
        lng: -41.4730227,
        name: "Hidden Jazz Den",
        description:
          "Step right up and discover the charms of this clandestine delight hidden away in the heart of Chicago. Enter a lively lounge that is the bees knees, decked out in true 1920s fashion.",
        price: 1920,
      },
      {
        ownerId: 5,
        address: "Suite 2701, Hyperion Tower",
        city: "Neo-Cascadia",
        state: "Solaris Central",
        country: "United Earth Federation",
        lat: 65.7645358,
        lng: -50.4730327,
        name: "Quantum Serenity",
        description:
          "Step into the future with our stunning property located in the dynamic skyline of our advanced city, perfect for the discerning traveler of 3267.",
        price: 3267,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  },
};
