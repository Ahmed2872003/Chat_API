const express = require("express");

const router = express.Router();

const { login, signup } = require("../controllers/auth");

const authentication = require("../middleware/authentication");

router.post("/login", authentication, login);

router.post("/signup", signup);

module.exports = router;
