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
const review = require("../../db/models/booking");

const spot = require("../../db/models/spot");

//////////! Get all of the Current User's Bookings ///////////

router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
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
              attributes: ["url"],
              where: { preview: true },
            },
          ],
        },
      ],
    });
    for (let i = 0; i < bookings.length; i++) {
      bookings[i].Spot.dataValues.lat = parseFloat(bookings[i].Spot.lat);
      bookings[i].Spot.dataValues.lng = parseFloat(bookings[i].Spot.lng);
      bookings[i].Spot.dataValues.price = parseFloat(bookings[i].Spot.price);
    }
    res.status(200).json({ Bookings: bookings });
  } catch (err) {
    next(err);
  }
});

//////////! Edit a Booking ///////////

router.put(
  "/:bookingId",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const errors = {};
    const currentDate = new Date().toISOString().split("T")[0];
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
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (new Date(booking.endDate) < currentDate) {
        return res
          .status(403)
          .json({ message: "Past bookings can't be modified" });
      }

      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      const conflict = await Booking.findOne({
        where: {
          id: { [Op.ne]: bookingId },
          spotId: booking.spotId,
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
      const updatedBooking = await booking.update({
        startDate: startDate,
        endDate: endDate,
      });

      return res.json(updatedBooking);
    } catch (err) {
      next(err);
    }
  }
);

//////////! Delete a Booking ///////////

router.delete(
  "/:bookingId",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    const { bookingId } = req.params;
    const userId = req.user.id;
    try {
      const booking = await Booking.findByPk(bookingId, {
        include: {
          model: Spot,
          attributes: ["ownerId"],
        },
      });
      if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
      }
      if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const today = new Date();
      if (new Date(booking.startDate) <= today) {
        return res.status(403).json({
          message: "Bookings that have been started can't be deleted",
        });
      }

      await booking.destroy();
      return res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
