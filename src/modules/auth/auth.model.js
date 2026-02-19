// Auth module shares the User model from users module
// This file serves as a re-export for module-level clarity
const User = require("../users/users.model");

module.exports = User;
