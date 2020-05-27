const express = require("express");
const router = express.Router();
const auth = require("./auth.routes.js");
const user = require("./users.routes.js");
const record = require("./records.routes.js");
const authMiddleware = require("../middleware");

router.use("/auth", auth);
router.use("/users", authMiddleware, user);
router.use("/records", authMiddleware, record);

module.exports = router;
