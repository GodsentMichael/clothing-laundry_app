//When something/page is not found.

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

//When something goes wrong with my API.
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
    // To avoid sending response twice.
    if (res.headersSent) {
        return next(err);
      }
}

module.exports = {notFound, errorHandler}; 