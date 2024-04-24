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
          "Escape to a one-of-a-kind getaway with our rustic cabin nestled in the heart of a breathtaking Jurassic landscape. We provide primitive yet comfortable amenities, spectacular views, and a private backyard. Enjoy the simple charm of our wooden cabin, featuring hand-crafted furniture, a stone fireplace, and small, comforting spaces illuminated by natural light. From the front porch, gaze out at a panoramic scene of ancient trees, towering ferns, and a variety of dinosaurs that transport you to another era. This cozy cabin offers an authentic step back in time, surrounded by lush prehistoric flora and mostly gentle dinosaurs roaming freely in the vicinity. But be careful, they don't all eat plants!",
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
          "Experience the enchantment of classical Greece in our beautifully preserved residence. This home features traditional Greek architecture with stone walls and terracotta roofs, providing a cool retreat from the Mediterranean sun. Inside, you'll find a cozy living space adorned with wooden furniture and hand-woven rugs, a simple yet functional kitchen with a classic hearth, and a tranquil stone-walled bathroom equipped with a traditional bathtub. Step outside and you are just moments away from some of the most famous historical sites in the world, including the Acropolis and the Parthenon. The local market, vibrant with the colors and scents of fresh produce and artisanal crafts, offers a taste of ancient Greek daily life.",
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
          "It is with utmost respect and pride that I present to you the opportunity to reside within our most grand and splendid Victorian domicile, situated in the most picturesque locale of our glorious United Kingdom. This residence, built in the esteemed style of our blessed Victorian era, offers an abode that is both sumptuous and stately, affording every comfort and luxury one might wish to procure. This dwelling is not merely a house but a veritable palace of living history, promising a lifestyle of unparalleled elegance and grace. Should you be inclined to partake in a living situation of exceptional standing, I invite you to make this esteemed residence your own.",
        price: 1885,
      },
      {
        ownerId: 4,
        address: "Charleston Ave",
        city: "Chicago",
        state: "Illinois",
        country: "United States of America",
        lat: 81.7645358,
        lng: -41.4730327,
        name: "Hidden Jazz Den",
        description:
          "Step right up and discover the charms of this clandestine delight hidden away in the heart of Chicago. Enter a lively lounge that is the bees knees, decked out in true 1920s fashion. Here, flappers and gents can mingle, sip on classic concoctions from the prohibition era, and tap their feet to the lively tunes of a jazz gramophone. The ambiance is electric, filled with the spirit and excitement of a bygone era. When the night draws to a close, sneak away to a cozy bedroom set discreetly in the corner. Our washroom is outfitted with the finest of the era's design, featuring a luxurious clawfoot tub and elegant pedestal sink. Dare to venture into the basement and glimpse the underpinnings of a lively speakeasy. Here, amongst the shadows of wooden crates and old barrels, the illicit brews concocted away from prying eyes.",
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
          "Step into the future with our stunning property located in the dynamic skyline of our advanced city, perfect for the discerning traveler of 3267. This ultramodern home is designed with sophistication and cutting-edge technology, offering an unrivaled urban experience. Enjoy a home with floating furniture, holographic displays, and smart surfaces that adapt to your preferences. The property features a spacious balcony that offers breathtaking views of the cityscape, complete with neon skyscrapers and bustling aerial traffic. Experience comfort and convenience with our fully automated home systems, including mind-controlled lighting, temperature, and entertainment. State-of-the-art security systems ensure your utmost privacy and safety during your stay. Whether you're visiting for business or leisure, our property provides the perfect fusion of luxury and technology, making it an ideal choice for your stay in the year 3267. Book now to secure your front-row seat to the future!",
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
