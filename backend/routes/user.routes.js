const profileController = require("../controllers/profile.controller")
const { authJwt, verifySignUp } = require("../middleware")
const db = require("../db")

const User = db.user

module.exports = function (app) {
    app.get("/api/user/publicProfile", profileController.getPublicProfile)
};
