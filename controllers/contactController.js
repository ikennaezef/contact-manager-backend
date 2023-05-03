const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact");
const User = require("../models/user");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find({ userID: req.user.id });
	res.status(200).json(contacts);
});

//@desc Create New Contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
	const { name, email, phone } = req.body;
	const { id } = req.user;
	if (!name || !email || !phone) {
		res.status(400);
		throw new Error("All fields are required");
	}

	const user = await User.findById(id);

	if (!user) {
		res.status(404).json({ message: "User not found" });
	}

	const newContact = await Contact.create({
		name,
		email,
		phone,
		userID: req.user.id,
	});

	return res.status(201).json(newContact);
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if (!contact) {
		return res.status(404).json({ message: "Contact not found" });
	}

	res.status(200).json(contact);
});

//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if (!contact) {
		return res.status(404).json({ message: "Contact not found" });
	}

	if (contact.userID.toString() !== req.user.id) {
		res.status(403);
		throw new Error("Users aren't allowed to change other users' contacts");
	}

	const updatedContact = await Contact.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	res.status(200).json(updatedContact);
});

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(404).json({ message: "User not found" });
	}

	if (!contact) {
		return res.status(404).json({ message: "Contact not found" });
	}

	if (contact.userID.toString() !== req.user.id) {
		res.status(403);
		throw new Error("Users aren't allowed to delete other users' contacts");
	}

	await Contact.findByIdAndDelete(req.params.id);
	res.status(200).json({ message: `Contact ${contact.name} deleted` });
});

module.exports = {
	getContacts,
	createContact,
	getContact,
	updateContact,
	deleteContact,
};
