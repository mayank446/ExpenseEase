const { Router } = require("express");
const validator = require("express-validator");
const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = Router();

router.get(
  "/",
  [
    validator.header("authorization").exists(),
    validator.oneOf([
      validator.body("group_id").exists(),
      validator.body("user_id").exists(),
    ]),
  ],
  auth,
  async (req, res) => {
    const { group_id: groupId, user_id: memberId } = req.body;
    if (group_id)
      return prisma.transactions.findMany({
        where: {
          groupId,
        },
      });
    if (user_id)
      return prisma.transactions.findMany({
        where: {
          OR: [{ lenderId: memberId }, { borrowerId: memberId }],
        },
      });
  }
);

router.post(
  "/",
  [
    validator.header("authorization").exists(),
    validator.body("groupId", "groupId is required").exists(),
    validator.body("lenderId", "lenderId is required").exists(),
    validator.body("borrowerId", "borrowerId is required").exists(),
    validator.body("amount", "amount is required").exists(),
  ],
  auth,
  (req, res) => {
    const { groupId, lenderId, borrowerId, amount } = req.body;
    if (!req.user.groups.includes(groupId))
      return res.status(400).send("User not in group");
    const user = prisma.transactions
      .create({
        data: {
          lenderId,
          borrowerId,
          amount,
          groupId,
        },
      })
      .then((user) => {
        return res.status(200).send({
          message: "Txn created",
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send("Txn creation error");
      });
  }
);

module.exports = router;
