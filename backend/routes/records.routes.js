const express = require("express");
const router = express.Router();
const recordController = require("../controllers/records");

router
  .route("/")
  .get(recordController.list)
  .post(recordController.create);
router.route("/export").get(recordController.generateRecords);
router
  .route("/:id")
  .get(recordController.read)
  .put(recordController.update)
  .delete(recordController.remove);

router.param("id", recordController.getSpecificRecord);

module.exports = router;
