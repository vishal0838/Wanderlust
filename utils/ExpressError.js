class ExpressError extends Error {
    constructor(statusCode, message) {
        super()
        this.statuscode = statusCode, 
        this.message = message
    }
}

module.exports = ExpressError;