const router = require("express").Router();
const { Customers, validate } = require("../models/customersModels");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const allCustomers = await Customers.find();
    res.status(200).send(allCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
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

router.get("/:id", async (req, res) => {
  try {
    const oneCustomer = await Customers.findOne({ code: req.params.id });
    console.log(oneCustomer);
    if (oneCustomer) {
      res.status(200).json({ data: oneCustomer });
    } else {
      res.status(404).json({ message: `${req.params.id} is not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await Customers.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send({ message: "Username already exist" });
    }
    const prefixCode = "TCN";
    const lastUser = await Customers.findOne({
      code: { $regex: `^${prefixCode}` },
    })
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
