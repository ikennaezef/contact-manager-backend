const asyncHandler = require("express-async-handler");

//@desc Get all contacts
//@route GET /api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
	res.status(200).json({ message: "Get contact from controller..." });
});

//@desc Create New Contact
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
	const { name, email, phone } = req.body;
	if (!name || !email || !phone) {
		res.status(400);
		throw new Error("All fields are required");
	}
	res
		.status(201)
		.json({ message: "Create new contact from controller...", data: req.body });
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async (req, res) => {
	res.status(200).json({ message: `Get contact for id ${req.params.id}` });
});

//@desc Update a contact
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res) => {
	res.status(200).json({ message: `Update contact for id ${req.params.id}` });
});

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
	res.status(200).json({ message: `Delete contact for id ${req.params.id}` });
});

module.exports = {
	getContacts,
	createContact,
	getContact,
	updateContact,
	deleteContact,
};
