const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUser,
	getUsers,
	deleteUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/current", validateToken, getUser);
router.get("/all", validateToken, getUsers);
router.delete("/delete/:id", validateToken, deleteUser);

module.exports = router;
