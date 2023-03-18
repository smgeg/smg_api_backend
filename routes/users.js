const router = require("express").Router();
const { User, validate } = require("../models/usersModels");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  User.find().then((users) => {
    // res.json(users);
    res.json(users.filter((user) => user.code.match(/(SCN)/)));
  });
});

// router.get("/", async (req, res) => {
//   const lastUser = await User.findOne().sort({ code: -1 }).limit(1);
//   let newCode = "";
//   if (lastUser) {
//     const lastCodeNum = parseInt(lastUser.code.substring(4), 10);
//     const nextCode = (lastCodeNum + 1).toString().padStart(2, "0");

//     newCode = `SCN-${nextCode}`;
//   } else {
//     newCode = "SCN-01";
//   }
//   res.json({ newCode });
// });

router.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => {
    res.json(user);
  });
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send({ message: "Username already exist" });
    }
    const prefixCode = "TCN";
    const lastUser = await User.findOne({ code: { $regex: `^${prefixCode}` } })
      .sort({ code: -1 })
      .limit(1);
    let newCode = "";
    if (lastUser) {
      const lastCodeNum = parseInt(lastUser.code.substring(4), 10);
      const nextCode = (lastCodeNum + 1).toString();

      newCode = `${prefixCode}-${nextCode}`;
    } else {
      newCode = `${prefixCode}-1`;
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await User({
      ...req.body,
      password: hashPassword,
      code: newCode,
    }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  }
});

module.exports = router;
