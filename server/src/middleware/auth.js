import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const verifyToken = async (req, res, next) => {
  //extract token from req.header

  const { authorization: token } = req.headers;

  if (!token) {
    return next(createHttpError(403, "You're unathenticated"));
  }
  //checking if bearer is included in the authorization

  if (!token.startsWith("Bearer")) {
    return next(createHttpError(401, "Token format is invalid"));
  }
  const extractToken = token.split(" ")[1];
  try {
    //token veritfy
    const decodedToken = await jwt.verify(
      extractToken,
      process.env.JWT_SECRET_KEY
    );
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

//authorised roles

export const authoriseRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, "User unauthorized for the request"));
    }
    //continue to the next middleware
    next();
  };
};
