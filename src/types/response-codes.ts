enum ResponseCodes {
	SUCCESS = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
	INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error: Something went wrong on our end. Please try again later or contact support if the issue persists.',
}

export default ResponseCodes;
