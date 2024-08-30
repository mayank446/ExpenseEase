const { Router } = require("express");
const validator = require("express-validator");
const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = Router();

router.post(
  "/:groupId",
  [
    validator.header("authorization").exists(),
    validator.param("groupId", "group id is required").isInt().exists(),
  ],
  auth,
  async (req, res) => {
    const { groupId } = req.params;
    try {
      // pending transactions of a group
      const transactions = await prisma.transactions.findMany({
        where: {
          groupId: parseInt(groupId),
          status: "pending",
        },
        select: {
          id: true,
          amount: true,
          lenderId: true,
          borrowerId: true,
        },
      });
      // perform the logic here

      // then insert the updated transactions in the database
      return res.status(200).send(transactions);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Group not found");
    }
  }
);
