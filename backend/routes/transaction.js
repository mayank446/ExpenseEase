const { Router } = require("express");
const validator = require("express-validator");
const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = Router();

router.post(
  "/list",
  [
    validator.header("authorization").exists(),
    validator.oneOf([
      validator.body("group_id").exists(),
      validator.body("user_id").exists(),
    ]),
  ],
  auth,
  // get all transactions of a group or a user with there lender, borrower and amount
  async (req, res) => {
    const user_id = req.user.id;
    const { group_id } = req.body;
    if (group_id) {
      prisma.transactions
        .findMany({
          where: {
            groupId: parseInt(group_id),
          },
          select: {
            lenderId: true,
            borrowerId: true,
            amount: true,
          },
        })
        .then((data) => {
          // get name of lender and borrower
          const lenderIds = data.map((item) => item.lenderId);
          const borrowerIds = data.map((item) => item.borrowerId);
          prisma.members
            .findMany({
              where: {
                id: {
                  in: lenderIds,
                },
              },
              select: {
                name: true,
                id: true,
              },
            })
            .then((lenders) => {
              prisma.members
                .findMany({
                  where: {
                    id: {
                      in: borrowerIds,
                    },
                  },
                  select: {
                    name: true,
                    id: true,
                  },
                })
                .then((borrowers) => {
                  const result = data.map((item) => {
                    const lender = lenders.find(
                      (lender) => lender.id === item.lenderId
                    );
                    const borrower = borrowers.find(
                      (borrower) => borrower.id === item.borrowerId
                    );
                    return {
                      lender: lender.name,
                      borrower: borrower.name,
                      amount: item.amount,
                    };
                  });
                  return res.status(200).send(result);
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(400).send("Txn not found");
                });
            })
            .catch((error) => {
              console.log(error);
              return res.status(400).send("Txn not found");
            });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).send("Txn not found");
        });
    } else {
      prisma.transactions
        .findMany({
          where: {
            borrowerId: parseInt(user_id),
          },
          select: {
            lenderId: true,
            borrowerId: true,
            amount: true,
          },
        })
        .then((data) => {
          return res.status(200).send(data);
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).send("Txn not found");
        });
    }
  }
);
// insert list of transactions for a particular group, body has to be an array of objects {groupId,list:{ borrowerId, amount}}
router.post(
  "/create-new",
  [
    validator.header("authorization").exists(),
    validator.body("list", "list is required").exists(),
    validator.body("name", "name is required").exists(),
    validator.body("groupId", "groupId is required").exists(),
  ],
  auth,
  async (req, res) => {
    try {
      const { list, groupId, name } = req.body;
      const user = await prisma.members.findUnique({
        where: {
          name,
        },
      });
      if (!user) return res.status(400).send("Name not found");
      const transactions = list.map((item) => {
        return {
          lenderId: parseInt(user.id),
          borrowerId: parseInt(item.id),
          amount: parseInt(item.amount),
          groupId: parseInt(groupId),
        };
      });
      // find previous transactions and update them as per provided list if any
      const previousTransactions = await prisma.transactions.findMany({
        where: {
          groupId: parseInt(groupId),
          status: "pending",
        },
      });
      // check if any transaction is already present then (do plus or minus) in the amount or create new transaction
      const newTransactions = transactions.map((transaction) => {
        const previousTransaction = previousTransactions.find(
          (item) =>
            item.borrowerId === transaction.borrowerId &&
            item.lenderId === transaction.lenderId
        );

        if (previousTransaction) {
          //delete previous transaction
          prisma.transactions
            .delete({
              where: {
                id: previousTransaction.id,
              },
            })
            .catch((error) => {
              console.log(error);
              return res.status(400).send("Txn creation error");
            });
          return {
            ...transaction,
            amount: previousTransaction.amount + transaction.amount,
          };
        } else {
          const reverseTransaction = previousTransactions.find(
            (item) =>
              item.borrowerId === transaction.lenderId &&
              item.lenderId === transaction.borrowerId
          );
          if (reverseTransaction) {
            //delete previous transaction
            prisma.transactions
              .delete({
                where: {
                  id: reverseTransaction.id,
                },
              })
              .catch((error) => {
                console.log(error);
                return res.status(400).send("Txn creation error");
              });
            return {
              ...transaction,
              amount: reverseTransaction.amount - transaction.amount,
            };
          }
        }
        return transaction;
      });
      // create new transactions
      const result = await prisma.transactions.createMany({
        data: newTransactions,
      });
      return res.status(200).send({
        message: "Txn created",
        list: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send("Txn creation error");
    }
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
    prisma.transactions
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
