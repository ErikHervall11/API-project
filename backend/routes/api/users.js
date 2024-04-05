// backend/routes/api/users.js
// const express = require("express");
// const router = express.Router();

const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
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

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];
// backend/routes/api/users.js
// ...

// Sign up
// backend/routes/api/users.js
// ...

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) {
    return res.status(500).json({
      message: "User already exists",
      errors: { email: "User with that email already exists" },
    });
  }

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) {
    return res.status(500).json({
      message: "User already exists",
      errors: { username: "User with that username already exists" },
    });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      email,
      firstName,
      lastName,
      username,
      hashedPassword,
    });

    await setTokenCookie(res, user);

    return res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        general: "An error occurred during the account creation process.",
      },
    });
  }
});

module.exports = router;
