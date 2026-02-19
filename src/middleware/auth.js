const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const User = require("../modules/users/users.model");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, "Not authorized to access this route"));
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    next();
  } catch (error) {
    next(new ApiError(401, "Not authorized to access this route"));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action")
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
