const { Router } = require("express");
const validator = require("express-validator");
const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = Router();

router.get(
  "/:groupId",
  [
    validator
      .header("authorization", "Authorization header is required")
      .exists(),
    validator.param("id", "id is required").isInt().exists(),
  ],
  auth,
  // get {name,id} of all members  of a group with groupId
  async (req, res) => {
    const { groupId } = req.params;
    prisma.groups
      .findUnique({
        where: {
          id: parseInt(groupId),
        },
        include: {
          members: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      .then((group) => {
        return res.status(200).send(group.members);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send("Group not found");
      });
  }
);

// router.get("/", (req, res) => {
//   res.send("Group route");
// });

// get name and id of all groups whose member is user
router.get(
  "/",
  [
    validator
      .header("authorization", "Authorization header is required")
      .exists(),
  ],
  auth,
  (req, res) => {
    prisma.groups
      .findMany({
        where: {
          members: {
            some: {
              id: req.user.id,
            },
          },
        },
      })
      .then((groups) => {
        return res.status(200).send(groups);
      })
      .catch((error) => {
        return res.status(400).send("Groups not found");
      });
  }
);

router.post(
  "/",
  [
    validator
      .header("authorization", "Authorization header is required")
      .exists(),
    validator.body("groupname", "groupname is required").exists(),
  ],
  auth,
  (req, res) => {
    const { groupname } = req.body;
    // console.log("groupname : ", groupname);
    const memberId = parseInt(req.user.id);
    prisma.groups
      .create({
        data: {
          groupname,
          members: {
            connect: {
              id: memberId,
            },
          },
        },
      })
      .then((group) => {
        return res.status(200).send({
          message: "Group created",
          group,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send("Group already exists");
      });
  }
);

router.post(
  "/add-member",
  [
    validator
      .header("authorization", "Authorization header is required")
      .exists(),
    validator.body("groupId", "groupId is required").exists(),
    validator.body("name", "name is required").exists(),
  ],
  auth,
  async (req, res) => {
    const { groupId, name } = req.body;
    const member = await prisma.members.findUnique({
      where: {
        name: name,
      },
    });
    if (!member) {
      return res.status(403).send("Member not found");
    }
    prisma.groups
      .update({
        where: {
          id: groupId,
        },
        data: {
          members: {
            connect: {
              id: member.id,
            },
          },
        },
      })
      .then((group) => {
        return res.status(200).send({
          message: "Member added",
          group,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error.message || "Group not found");
      });
  }
);

module.exports = router;
