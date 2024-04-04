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
const review = require("../../db/models/review");
const { route } = require("./reviews");

//////////! GET ///////////

router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const spot = await Spot.findByPk(userId);

    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const reviews = await Review.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
          include: [
            {
              model: SpotImage,
              where: { preview: true },
              attributes: ["url"],
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    res.status(200).json({ Reviews: reviews });
  } catch (err) {
    next(err);
  }
});

//////////! GET ///////////

module.exports = router;
