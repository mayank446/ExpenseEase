const express = require("express");
const app = express();
const port = 8000;
const morgan = require("morgan");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const prisma = require("./prisma");

app.use(morgan("tiny"));
// app.use(morgan());
app.use(express.json());

const routes = require("./routes");

app.get("/", (req, res) => {
  res.send("status : success");
});

for (const route in routes) {
  app.use(`/${route}`, routes[route]);
}

app.post("/create-user", async (req, res) => {
  await prisma.members.create({
    data: {
      name: "meek",
      // lent: [],
      // borrowed: [],
      // groups: []
    },
  });
  res.send("user created");
});

app.post("/create-group", async (req, res) => {
  await prisma.groups.create({
    data: {
      id: 2,
      groupname: "Hawai",
    },
  });
  res.send("creating...");
});

app.post("/createTransaction", async (req, res) => {
  const { lenderId, borrowerId, amount, groupId } = req.body;

  try {
    // Validate request body
    if (!lenderId || !borrowerId || amount === undefined || !groupId) {
      return res.status(400).send("Missing required fields");
    }

    // Check if the group exists
    const group = await prisma.groups.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      return res.status(404).send("Group not found");
    }

    // Check if the lender and borrower exist
    const lender = await prisma.user.findUnique({
      where: { id: lenderId },
    });
    const borrower = await prisma.user.findUnique({
      where: { id: borrowerId },
    });
    if (!lender || !borrower) {
      return res.status(404).send("Lender or Borrower not found");
    }

    // Create the transaction
    const transaction = await prisma.transactions.create({
      data: {
        lenderId: lenderId,
        borrowerId: borrowerId,
        amount: amount,
        groupId: groupId,
      },
    });

    res.status(201).json(transaction); // Respond with the created transaction
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).send("An error occurred while creating the transaction");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
