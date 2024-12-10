const { Router } = require("express");
const validator = require("express-validator");
const prisma = require("../prisma");
const auth = require("../middleware/auth");
const finalAlgo = require("../controller/algo");

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
    console.log(groupId);
    try {
      // pending transactions of a group
      let transactions = await prisma.transactions.findMany({
        where: {
          groupId: parseInt(groupId),
          // status: "pending",
        },
        select: {
          id: true,
          amount: true,
          lenderId: true,
          borrowerId: true,
        },
      });
      transactions = transactions.map((t) => [
        t.lenderId,
        t.borrowerId,
        t.amount,
      ]);
      console.log(transactions);
      // // perform the logic here
      transactions = finalAlgo(transactions);

      console.log("transactions : ", transactions);

      // // then insert the updated transactions in the database
      await prisma.transactions.deleteMany({
        where: {
          groupId: parseInt(groupId),
        },
      });
      await prisma.transactions.createMany({
        data: transactions.map((t) => ({
          groupId: parseInt(groupId),
          lenderId: t[0],
          borrowerId: t[1],
          amount: t[2],
        })),
      });

      return res.status(200).send(transactions);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Group not found");
    }
  }
);

module.exports = router;
