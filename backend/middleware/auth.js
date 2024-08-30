const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // verify using token
  const token = req.headers.authorization;
  // console.log(token);
  if (!token) {
    return res.status(402).send("Unauthorized");
  }

  // parse token
  const tokenBody = token.split(" ")[1];
  if (!tokenBody) {
    return res.status(400).send("Unauthorized");
  }

  // verify token
  try {
    const data = jwt.verify(tokenBody, "secret");
    // console.log("data : ", data);
    const user = await prisma.members.findUnique({
      where: { id: data.id },
    });
    // console.log(user);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).send("Unauthorized");
  }
};
