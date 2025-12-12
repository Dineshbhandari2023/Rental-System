module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE || "1d",
  cookieExpire: 1 * 24 * 60 * 60 * 1000, // 1 days in milliseconds
};
