const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const {
  User,
  SpotImage,
  Spot,
  Booking,
  Review,
  ReviewImage,
} = require("../../db/models");

const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");

async function avgStars(...spots) {
  spots = spots[0];
  for (const spot of spots) {
    const reviews = await Review.findAll({
      where: { spotId: spot.dataValues.id },
    });
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    spot.dataValues.avgRating = totalStars / reviews.length;
  }
}

async function findPrevImg(...spots) {
  spots = spots[0];
  for (const spot of spots) {
    const previewImg = await SpotImage.findAll({
      where: {
        id: spot.dataValues.id,
        preview: true,
      },
    });
    if (previewImg.length === 0) {
      spot.dataValues.previewImage = null;
    } else {
      spot.dataValues.previewImage = previewImg[0].dataValues.url;
    }
  }
}

router.get("/", async (req, res, next) => {
  try {
    const spots = await Spot.findAll();
    await avgStars(spots);
    await findPrevImg(spots);
    res.json(spots);
  } catch (error) {
    next(error);
  }
});

router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  try {
    const spots = await Spot.findAll({
      where: {
        ownerId: user.id,
      },
    });
    await avgStars(spots);
    await findPrevImg(spots);
    res.json(spots);
  } catch (error) {
    next(error);
  }
});

router.get("/:spotId", async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findAll({
    where: {
      id: spotId,
    },
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      // {
      //   model: Owner,
      // },
    ],
  });

  // console.log(spot[0].dataValues.SpotImages);
  if (!spot) {
    let err = new Error();
    err.message = "Spot couldn't be found";
    err.status = 404;
  }

  await avgStars(spot);

  res.status(200).json(spot);
});

module.exports = router;
