const { Router } = require("express");
const validator = require("express-validator");
const prisma = require("../prisma");
const { generateTokenResponse } = require("../utils/token");
const auth = require("../middleware/auth");

const router = Router();

router.get(
  "/",
  [validator.header("authorization").exists()],
  auth,
  (req, res) => {
    return req.user;
  }
);

router.post(
  "/",
  [
    validator.body("name", "name is required").exists(),
    validator.body("password", "password is required").exists(),
    validator.body("email", "email is required").exists().isEmail(),
  ],
  async (req, res) => {
    const { name, password, email } = req.body;
    try {
      let user = await prisma.members.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        user = await prisma.members.create({
          data: {
            name: name,
            password: password,
            email: email,
          },
        });
      }
      const token = generateTokenResponse({ id: user.id, email: user.email });
      return res.status(200).send(token);
    } catch (error) {
      console.log(error);
      return res.status(400).send("User already exists");
    }
  }
);

router.put(
  "/",
  [validator.header("authorization").exists()],
  auth,
  (req, res) => {
    const { name, password, email } = req.body;
    prisma.members
      .update({
        where: {
          id: req.user.id,
        },
        data: {
          name: name,
          email: email,
          password: password,
        },
      })
      .then((user) => {
        return res.status(200).send({
          message: "User updated",
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send("User already exists");
      });
  }
);

router.delete(
  "/",
  [validator.header("authorization").exists()],
  auth,
  (req, res) => {
    const { id } = req.body;
    prisma.members
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send("User not found");
      });
    return 200, { message: "User deleted" };
  }
);

module.exports = router;
