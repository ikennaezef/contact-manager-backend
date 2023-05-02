const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "The username field is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "The email field is required"],
			unique: [true, "Email address is already taken"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
