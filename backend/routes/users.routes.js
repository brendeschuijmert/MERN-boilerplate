const express = require("express");
const router = express.Router();
const { Roles } = require("../constants");
const userController = require("../controllers/users");
const permissions = require("../utils");

router.use(permissions.hasRole([Roles.ADMIN, Roles.MANAGER]));

router
  .route("/")
  .get(userController.list)
  .post(userController.create);

router
  .route("/:id")
  .get(userController.read)
  .put(userController.update)
  .delete(userController.remove);

router.param("id", userController.getSpecificUser);

module.exports = router;
