const router = require("express").Router();

const { getUser, updateUser, getUserByID } = require("../controllers/user");

router.get("/", getUser);

router.get("/:id", getUserByID);

router.route("/").patch(updateUser);

module.exports = router;
