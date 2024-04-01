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
  Session,
  Spot,
  Booking,
  Review,
  ReviewImage,
} = require("../../db/models");

const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");

router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll();
  res.status(200).json(spots);
});

router.get("/current", requireAuth, async (req, res, next) => {
  const currentUserId = req.user.id;
  const ownedSpots = await Spot.findAll({
    where: { ownerId: currentUserId },
  });
  res.status(200).json({ Spots: ownedSpots });
});

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
