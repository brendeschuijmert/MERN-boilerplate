module.exports = {
  Roles: { USER: 0, MANAGER: 1, ADMIN: 2 },
  unauthorized: {
    message: "Permission denied.",
    code: 403
  },
  notFound: {
    message: "Not found.",
    code: 404
  },
  invalidCredential: {
    message: "Invalid credential. Email and password does not match.",
    code: 401
  },
  serverError: {
    message: "Internal server error.",
    code: 500
  },
  userAlreadyRegistered: {
    message: "User already registered.",
    code: 409
  },
  noOverDailyHours: {
    message: "Couldn't work more than 24 hours a day.",
    code: 400
  },
  invalidToken: {
    message: "Invalid token.",
    code: 400
  },
  accessDenied: {
    message: "Access denied. No token provided.",
    code: 401
  },
  badRequest: {
    message: "Bad request",
    code: 400
  }
};
