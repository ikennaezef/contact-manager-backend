const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;
	switch (statusCode) {
		case constants.VALIDATION_ERROR:
			res.json({
				title: "Validation Failed",
				mesasge: err.message,
				stackTrace: err.stack,
			});
			break;
		case constants.FORBIDDEN:
			res.json({
				title: "Forbidden",
				mesasge: err.message,
				stackTrace: err.stack,
			});
			break;
		case constants.UNAUTHORIZED:
			res.json({
				title: "Unauthorized",
				mesasge: err.message,
				stackTrace: err.stack,
			});
			break;
		case constants.NOT_FOUND:
			res.json({
				title: "Not Found",
				mesasge: err.message,
				stackTrace: err.stack,
			});
			break;
		case constants.SERVER_ERROR:
			res.json({
				title: "Server Error",
				mesasge: err.message,
				stackTrace: err.stack,
			});
			break;
		default:
			console.log("No error. All GOOD!");
			break;
	}
};

module.exports = errorHandler;
