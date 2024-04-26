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
  spots = spots.flat();

  // if (!Array.isArray(spots) || spots.length === 1) {
  //   spots = spots;
  // }
  for (const spot of spots) {
    const reviews = await Review.findAll({
      where: { spotId: spot.id },
    });
    if (reviews.length === 0) {
      spot.dataValues.avgRating = "New";
    } else {
      const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
      spot.dataValues.avgRating = (totalStars / reviews.length).toFixed(1);
    }
  }
}

async function findPrevImg(...spots) {
  spots = spots[0];
  for (const spot of spots) {
    const previewImg = await SpotImage.findAll({
      where: {
        spotId: spot.dataValues.id,
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

//////////! GET ///////////

router.get("/", async (req, res, next) => {
  let { page = 1, size = 20 } = req.query;
  page = parseInt(page);
  size = parseInt(size);

  if (
    isNaN(page) ||
    page < 1 ||
    page > 10 ||
    isNaN(size) ||
    size < 1 ||
    size > 20
  ) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        page: "Page must be between 1 and 10",
        size: "Size must be between 1 and 20",
      },
    });
  }

  try {
    const offset = (page - 1) * size;
    const spots = await Spot.findAll({
      limit: size,
      offset: offset,
    });
    await avgStars(spots);
    await findPrevImg(spots);

    for (let i = 0; i < spots.length; i++) {
      spots[i].dataValues.lat = parseFloat(spots[i].lat);
      spots[i].dataValues.lng = parseFloat(spots[i].lng);
      spots[i].dataValues.price = parseFloat(spots[i].price);
    }

    res.json({ Spots: spots, page, size });
  } catch (error) {
    next(error);
  }
});

//////////! GET ///////////

router.get(
  "/current",
  handleValidationErrors,
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    try {
      const spots = await Spot.findAll({
        where: {
          ownerId: user.id,
        },
      });
      await avgStars(spots);
      await findPrevImg(spots);
      for (let i = 0; i < spots.length; i++) {
        spots[i].dataValues.lat = parseFloat(spots[i].lat);
        spots[i].dataValues.lng = parseFloat(spots[i].lng);
        spots[i].dataValues.price = parseFloat(spots[i].price);
      }
      res.json({ Spots: spots });
    } catch (error) {
      next(error);
    }
  }
);

//////////! GET ///////////

router.get("/:spotId", async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findOne({
    where: {
      id: spotId,
    },
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        as: "Owner",
      },
    ],
  });
  if (!spot || spot === null) {
    let err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  const reviews = await Review.findAll({
    where: {
      spotId: spotId,
    },
  });
  await avgStars(spot);
  spot.dataValues.numReviews = reviews.length;

  spot.dataValues.lat = parseFloat(spot.lat);
  spot.dataValues.lng = parseFloat(spot.lng);
  spot.dataValues.price = parseFloat(spot.price);

  res.status(200).json(spot);
});

//////////! POST ///////////

router.post(
  "/",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { user } = req;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    try {
      let newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });
      newSpot.dataValues.lat = parseFloat(newSpot.lat);
      newSpot.dataValues.lng = parseFloat(newSpot.lng);
      newSpot.dataValues.price = parseFloat(newSpot.price);

      return res.status(201).json(newSpot);
    } catch (err) {
      err.status = 400;
      err.message = "Bad Request";
      next(err);
    }
  }
);

//////////! POST ///////////

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = parseInt(req.params.spotId);
  const { url, preview } = req.body;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    throw err;
  }
  if (spot.ownerId !== userId) {
    res.status(403).json({ message: "Forbidden" });
  }

  const newImage = await SpotImage.create({
    spotId: spotId,
    url: url,
    preview: preview,
  });

  const payload = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };

  res.status(200).json(payload);
});

//////////! PUT ///////////

router.put(
  "/:spotId",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const userId = req.user.id;
    const { spotId } = req.params;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    try {
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
      if (spot.ownerId !== userId) {
        res.status(403).json({ message: "Forbidden" });
      }

      await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });

      res.status(200).json(spot);
    } catch (err) {
      err.status = 400;
      err.message = "Bad Request";
      next(err);
    }
  }
);

//////////! DELETE ///////////
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      throw err;
    }
    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spot.destroy();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

//////////! GET ///////////

router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
      where: { spotId: spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });
    for (let i = 0; i < spot.length; i++) {
      spot[i].dataValues.lat = parseFloat(spot[i].lat);
      spot[i].dataValues.lng = parseFloat(spot[i].lng);
      spot[i].dataValues.price = parseFloat(spot[i].price);
    }
    res.status(200).json({ Reviews: reviews });
  } catch (err) {
    next(err);
  }
});

//////////! POST ///////////

router.post(
  "/:spotId/reviews",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const spotId = req.params.spotId;

    const { review, stars } = req.body;
    const userId = req.user.id;
    const parsedSpotId = parseInt(spotId, 10);

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
      const spot = await Spot.findByPk(parsedSpotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      const reviews = await Review.findOne({
        where: { spotId: parsedSpotId, userId: userId },
      });

      if (reviews) {
        return res
          .status(500)
          .json({ message: "User already has a review for this spot" });
      }

      const newReview = await Review.create({
        userId: userId,
        spotId: parsedSpotId,
        review: review,
        stars: stars,
      });

      const reviewWithDetails = await Review.findByPk(newReview.id, {
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      res.status(201).json(reviewWithDetails);
    } catch (err) {
      next(err);
    }
  }
);

//////////! Get all Bookings for a Spot based on the Spot's id ///////////

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
      const bookings = await Booking.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
      res.status(200).json({ Bookings: bookings });
    } else {
      const bookings = await Booking.findAll({
        where: { spotId },
        attributes: ["spotId", "startDate", "endDate"],
      });
      res.status(200).json({ Bookings: bookings });
    }
  } catch (err) {
    next(err);
  }
});

////////! Create a Booking from a Spot based on the Spot's id /////////

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  const errors = {};
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (!startDate || new Date(startDate) < new Date(currentDate)) {
    errors.startDate = "startDate cannot be in the past";
  }
  if (!endDate || new Date(endDate) <= new Date(startDate)) {
    errors.endDate = "endDate cannot be on or before startDate";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors });
  }

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (spot.ownerId === userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const conflict = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDateTime,
              [Op.gte]: startDateTime,
            },
          },
          {
            endDate: {
              [Op.lte]: endDateTime,
              [Op.gte]: startDateTime,
            },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDateTime } },
              { endDate: { [Op.gte]: endDateTime } },
            ],
          },
          {
            [Op.and]: [
              { startDate: { [Op.gte]: startDateTime } },
              { endDate: { [Op.lte]: endDateTime } },
            ],
          },

          { startDate: endDateTime },
          { endDate: startDateTime },
          { startDate: startDateTime },
          { endDate: endDateTime },
        ],
      },
    });

    if (conflict) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const newBooking = await Booking.create({
      userId,
      spotId,
      startDate,
      endDate,
    });
    res.status(200).json(newBooking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
