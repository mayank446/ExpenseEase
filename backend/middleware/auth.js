const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // verify using token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  // parse token
  const tokenBody = token.split(" ")[1];

  // verify token
  try {
    const name = jwt.verify(tokenBody, "secret");
    const user = await prisma.members.findUnique({ where: { name } });
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};
