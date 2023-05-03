const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Contact = require("../models/contact");
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
//@route GET /api/users/all
//@access private
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	if (!users) {
		res.status(404).json({ message: "Users not found" });
	}

	const usersList = users.map((user) => {
		return {
			id: user.id,
			email: user.email,
			username: user.username,
		};
	});
	res.status(200).json(usersList);
});

//@desc Delete a user
//@route DELETE /api/users/delete/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	const contacts = await Contact.find({ userID: req.params.id });
	const contactIds = contacts.map((contact) => {
		return contact.id;
	});

	if (user.id !== req.user.id) {
		return res.status(403).json({
			message: "Users are not allowed to delete other users' accounts",
		});
	}

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	// delete the user's contacts
	await Contact.deleteMany({ _id: { $in: contactIds } });

	await User.findByIdAndDelete(req.params.id);

	res
		.status(200)
		.json({ message: `User ${user.username} and contacts have been deleted` });
});

module.exports = {
	registerUser,
	loginUser,
	getUser,
	getUsers,
	deleteUser,
};
