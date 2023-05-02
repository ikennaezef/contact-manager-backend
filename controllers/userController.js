const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		res.status(400).json({ message: "All the fields are required" });
	}
	const duplicateUsername = await User.findOne({ username });
	const duplicateEmail = await User.findOne({ email });
	if (duplicateEmail) {
		return res.status(400).json({ message: "Email already registered" });
	}
	if (duplicateUsername) {
		return res.status(400).json({ message: "Username already taken!" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({
		username,
		email,
		password: hashedPassword,
	});
	if (newUser) {
		return res.status(201).json({ _id: newUser._id, email: newUser.email });
	} else {
		return res.status(400).json({ message: "User not valid" });
	}
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const user = await User.findOne({ email });
	if (!user) {
		res.status(404).json({ message: "User not found" });
	}

	const passwordIsCorrect = await bcrypt.compare(password, user.password);
	if (!passwordIsCorrect) {
		res.status(400).json({ message: "Incorrect username or password!" });
	}

	const accessToken = jwt.sign(
		{
			user: {
				username: user.username,
				email: user.email,
				id: user.id,
			},
		},
		process.env.ACCESS_TOKEN_SECRET
	);
	res.status(200).json({ userID: user.id, token: accessToken });
});

//@desc Get a user's details
//@route GET /api/users/current
//@access private
const getUser = asyncHandler(async (req, res) => {
	res.json(req.user);
});

//@desc Get a user's details
//@route GET /api/users/current
//@access private
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	if (!users) {
	}
	res.json(users);
});

//@desc Delete a user
//@route DELETE /api/users
//@access public
const deleteUser = asyncHandler(async (req, res) => {
	res.json({ message: `Delete the user ${req.params.id}` });
});

module.exports = {
	registerUser,
	loginUser,
	getUser,
	getUsers,
	deleteUser,
};
