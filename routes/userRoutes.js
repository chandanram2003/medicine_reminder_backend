const express = require("express");
const router = express.Router();

const { 
  registerUser, 
  loginUser,
  logoutUser
} = require("../controllers/userController");

const { authenticateJWT } = require("../middleware/auth.middleware");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", authenticateJWT, logoutUser);


module.exports = router;
