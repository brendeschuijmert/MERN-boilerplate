const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const RecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    required: true
  },
  hour: {
    type: Number,
    default: 1,
    min: [0, "Hour must be more than 0"],
    max: [24, "Hour should be less than 24"]
  },
  totalHours: {
    type: Number,
    default: 1,
    min: [0, "Hour must be more than 0"],
    max: [24, "Hour should be less than 24"]
  },
  note: {
    type: String,
    default: ""
  }
});

const Record = mongoose.model("Record", RecordSchema);

const createValidateRecord = record => {
  return Joi.validate(record, {
    date: Joi.date()
      .required()
      .default(Date.now()),
    hour: Joi.number()
      .required()
      .positive()
      .max(24)
      .default(0),
    note: Joi.string()
      .optional()
      .default(""),
    user: Joi.objectId().required()
  });
};

const updateValidateRecord = record => {
  return Joi.validate(record, {
    date: Joi.date().optional(),
    hour: Joi.number()
      .optional()
      .positive()
      .max(24),
    note: Joi.string().optional(),
    user: Joi.objectId().required()
  });
};

module.exports = {
  Record,
  createValidate: createValidateRecord,
  updateValidate: updateValidateRecord
};
