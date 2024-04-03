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

// router.get("/current", requireAuth, async (req, res, next) => {
//   const currentUserId = req.user.id;
//   const ownedSpots = await Spot.findAll({
//     where: { ownerId: currentUserId },
//   });
//   res.status(200).json({ Spots: ownedSpots });
// });

router.get(":spotId", async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

module.exports = router;
