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
              as: "previewImage",
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

//////////! Add an Image to a Review based on the Review's id ///////////

router.post(
  "/:reviewId/images",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { url } = req.body;
      const userId = req.user.id;

      const review = await Review.findByPk(reviewId);

      if (!review) {
        res.status(404).json({ message: "Review couldn't be found" });
      }
      if (review.userId !== userId) {
        res.status(403).json({ message: "Forbidden" });
      }

      const imagesCount = await ReviewImage.count({ where: { reviewId } });

      if (imagesCount >= 10) {
        res.status(403).json({
          message: "Maximum number of images for this resource was reached",
        });
      }

      const reviewImage = await ReviewImage.create({ reviewId, url });

      res.status(200).json(reviewImage);
    } catch (error) {
      next(error);
    }
  }
);

//////////! Edit a Review ///////////

router.put(
  "/:reviewId",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    if (!review || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }
    try {
      const reviewUpdate = await Review.findByPk(reviewId);

      if (!reviewUpdate) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }

      if (reviewUpdate.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await reviewUpdate.update({ review, stars });

      return res.status(200).json(reviewUpdate);
    } catch (error) {
      next(error);
    }
  }
);

//////////! Delete a Review ///////////

router.delete(
  "/:reviewId",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    try {
      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await review.destroy();
      return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
