const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

exports.generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);

  // Cookie options
  const options = {
    expires: new Date(Date.now() + jwtConfig.cookieExpire),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
