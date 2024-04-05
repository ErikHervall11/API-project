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
const spotimage = require("../../db/models/spotimage");

router.delete("/spot-images/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const userId = req.user.id; // Assuming `req.user` is populated by the authentication middleware

  try {
    // Find the SpotImage and include the associated Spot to check ownership
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ["ownerId"],
      },
    });

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Verify that the spot belongs to the current user
    if (spotImage.Spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete the image
    await spotImage.destroy();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
