const moment = require("moment");
const { isInteger, assign, toNumber, sumBy, get, extend } = require("lodash");
const { Record, createValidate, updateValidate } = require("../models/record");
const ObjectId = require("mongodb").ObjectID;
const {
  Roles,
  noOverDailyHours,
  notFound,
  unauthorized
} = require("../constants");

async function isOverHours(record) {
  let where = {
    date: record.date,
    _id: { $ne: record._id },
    user: record.user
  };

  const records = await Record.find(where);
  if (records.length) {
    let totalHourByDate = sumBy(records, "hour") + record.hour;
    if (totalHourByDate > 24) {
      return true;
    }
  }
  return false;
}

async function totalHours(record) {
  let where = {
    date: record.date,
    user: record.user
  };

  const records = await Record.find(where);
  if (records.length) {
    const totalHoursByDate = sumBy(records, "hour");
    return totalHoursByDate;
  }
  return 0;
}

function isInvalidDate(from, to) {
  return (from && !moment(from).isValid()) || (to && !moment(to).isValid());
}

function read(req, res, next) {
  res.json(req.record);
}

async function list(req, res, next) {
  try {
    const { from, to, page = 1, limit = 5, user = [] } = req.query;

    let where = {};
    if (req.user.role < Roles.ADMIN) {
      where = { user: ObjectId(req.user._id) };
    }

    if (isInvalidDate(from, to)) {
      return res
        .status(422)
        .send({ message: "Start date and end date must be valid date." });
    }

    if (to && from && moment(to).isBefore(moment(from))) {
      return res
        .status(422)
        .send({ message: "Start date must be before end date." });
    }

    if (from && to)
      where["date"] = { $gte: new Date(from), $lte: new Date(to) };
    else if (from && !to) where["date"] = { $gte: new Date(from) };
    else if (!from && to) where["date"] = { $lte: new Date(to) };

    if (user.length && req.user.role === Roles.ADMIN) {
      where["user"] = { $in: user.map(a => ObjectId(a)) };
    }

    if (
      !isInteger(toNumber(page)) ||
      !isInteger(toNumber(limit)) ||
      toNumber(page) <= 0 ||
      toNumber(page) <= 0
    ) {
      return res
        .status(422)
        .send({ message: "Page and rows per page must be positive integer." });
    }
    const records = await Record.find(where)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "-password -passwordConfirm")
      .sort("-date");

    await Promise.all(
      records.map(async record => {
        record.totalHours = await totalHours(record);
        record.save();
        return record;
      })
    );

    const count = await Record.countDocuments(where);

    res.json({ records, count });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    if (req.user.role < Roles.ADMIN) {
      req.body.user = req.user._id;
    }

    const { error } = createValidate(req.body);
    if (error)
      return res.status(400).send({
        message: get(error, "details.0.message", "Something went wrong.")
      });
    req.body.date = moment(req.body.date).locale("en");
    const record = new Record(req.body);

    if (await isOverHours(record)) {
      return res
        .status(noOverDailyHours.code)
        .send({ message: noOverDailyHours.message });
    }

    const newRecord = await record.save();
    res.json(newRecord);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    if (req.user.role < Roles.ADMIN) {
      req.body.user = req.user._id;
    }
    const { error } = updateValidate(req.body);
    if (error)
      return res.status(400).send({
        message: get(error, "details.0.message", "Something went wrong.")
      });
    req.body.date = moment(req.body.date).locale("en");
    assign(req.record, req.body);

    if (await isOverHours(req.record)) {
      return res
        .status(noOverDailyHours.code)
        .send({ message: noOverDailyHours.message });
    }

    const updatedRecord = await await req.record.save();
    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  await req.record.remove();
  res.json({ id: req.record._id });
}

async function getSpecificRecord(req, res, next, id) {
  try {
    const record = await Record.findById(id);

    if (!record) {
      return res.status(notFound.code).send({ message: notFound.message });
    }
    if (
      req.user.role !== Roles.ADMIN &&
      req.user._id !== record.user.toString()
    ) {
      return res
        .status(unauthorized.code)
        .send({ message: unauthorized.message });
    }

    req.record = record;
    next();
  } catch (error) {
    next(error);
  }
}

async function generateRecords(req, res, next) {
  try {
    const { from, to, user = [] } = req.query;
    let where = {};
    if (req.user.role < Roles.ADMIN) where = { user: ObjectId(req.user._id) };

    if (isInvalidDate(from, to)) {
      return res
        .status(422)
        .send({ message: "Start date and end date must be valid date." });
    }

    if (to && from && moment(to).isBefore(moment(from))) {
      return res
        .status(422)
        .send({ message: "Start date must be before end date." });
    }

    if (user.length && req.user.role === Roles.ADMIN) {
      where["user"] = { $in: user.map(a => ObjectId(a)) };
    }

    if (from && to)
      where["date"] = { $gte: new Date(from), $lte: new Date(to) };
    else if (from && !to) where["date"] = { $gte: new Date(from) };
    else if (!from && to) where["date"] = { $lte: new Date(to) };

    const records = await Record.aggregate([
      {
        $match: where
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unset: "user.password" },
      { $unset: "user.passwordConfirm" },
      {
        $group: {
          _id: { user: "$user", date: "$date" },
          note: { $push: "$note" },
          hour: { $sum: "$hour" },
          user: { $first: "$user" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({ records });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  create,
  update,
  read,
  list,
  remove,
  getSpecificRecord,
  generateRecords
};
