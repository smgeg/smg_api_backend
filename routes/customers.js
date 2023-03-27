const router = require("express").Router();
const { Customers, validate } = require("../models/customersModels");
const Joi = require("joi");
const bcrypt = require("bcrypt");

// Get ALL CUSTOMERS
router.get("/", async (req, res) => {
  try {
    const allCustomers = await Customers.find();
    res.status(200).send(allCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// get one customer by ID
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

// Create a new customer
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

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const createdCustomer = await Customers({
      ...req.body,
      password: hashPassword,
    }).save();
    res.status(201).send({
      message: "Customer created successfully",
      createdCustomer: createdCustomer,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  }
});

// delete customer
router.delete("/:id", async (req, res) => {
  const deletedCustomer = await Customers.findOneAndDelete({
    code: req.params.id,
  });
  try {
    if (deletedCustomer) {
      res.status(200).json({
        message: "Customer deleted successfully",
        deletedCustomer: deletedCustomer,
      });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: err });
  }
});

router.patch("/:id", async (req, res) => {
  const updateOps = { ...req.body };

  try {
    const customer = await Customers.findOneAndUpdate(
      { code: req.params.id },
      { $set: updateOps },
      { new: true }
    );
    if (customer) {
      res.status(200).json({
        message: "Customer updated successfully",
        updatedCustomer: customer,
      });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
