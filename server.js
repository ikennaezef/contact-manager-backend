const express = require("express");
const dotenv = require("dotenv").config();
const contactRouter = require("./routes/contactRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
