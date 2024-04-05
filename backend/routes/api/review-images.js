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
const reviewImage = require("../../db/models/reviewimage");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId, {
      include: [
        {
          model: Review,
          attributes: ["userId"],
        },
      ],
    });

    if (!reviewImage) {
      return res
        .status(404)
        .json({ message: "Review Image couldn't be found" });
    }

    if (reviewImage.Review.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await reviewImage.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
