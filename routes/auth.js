const express = require("express");

const router = express.Router();

const { login, signup } = require("../controllers/auth");

const authorization = require("../middleware/authorization");

const authentication = require("../middleware/authentication");

router.post("/login", authentication, login);

router.post("/signup", signup);

router.post("/", authorization);

module.exports = router;
