const jwt = require("jsonwebtoken");

function generateTokenResponse(payload) {
  return {
    access: jwt.sign(payload, "secret", {
      expiresIn: "30d",
    }),
  };
}

module.exports = {
  generateTokenResponse,
};
