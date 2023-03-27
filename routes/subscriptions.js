const router = require("express").Router();
const { Subscriptions, validate } = require("../models/subscriptionModels");
const { Courses } = require("../models/coursesModels");
const { Customers } = require("../models/customersModels");
router.get("/", async (req, res) => {
  try {
    const subscriptions = await Subscriptions.find().exec();

    const courses = await Courses.find({
      code: { $in: subscriptions.map((sub) => sub.course_code) },
    }).exec();

    const customers = await Customers.find({
      code: { $in: subscriptions.map((sub) => sub.customer_code) },
    }).exec();

    const allSubscriptions = subscriptions.map((sub) => {
      const course = courses.find((c) => c.code === sub.course_code);
      const customer = customers.find((c) => c.code === sub.customer_code);
      return {
        code: sub.code,
        course,
        customer,
        createdAt: sub.createdAt,
      };
    });

    res.status(200).json(allSubscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const oneSubscription = await Subscriptions.findOne({
      code: req.params.id,
    });
    if (oneSubscription) {
      res.status(200).json({ data: oneSubscription });
    } else {
      res.status(404).json({
        message: `Subscription with code ${req.params.id} was not found`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newSubscription = new Subscriptions(req.body);
    const savedSubscription = await newSubscription.save();
    res.status(201).json({ data: savedSubscription });
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.message.includes("code")) {
      res
        .status(500)
        .json({ message: "Subscription with the same code already exists" });
    } else {
      res.status(500).json({
        message: "Failed to create subscription",
        error: error.message,
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedSubscription = await Subscriptions.findOneAndDelete({
      code: req.params.id,
    });
    if (deletedSubscription) {
      res.status(200).json({
        message: "Subscription deleted successfully",
        data: deletedSubscription,
      });
    } else {
      res.status(404).json({
        message: `Subscription with code ${req.params.id} was not found`,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete subscription", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedSubscription = await Subscriptions.findOneAndUpdate(
      { code: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (updatedSubscription) {
      res.status(200).json({
        message: "Subscription updated successfully",
        data: updatedSubscription,
      });
    } else {
      res.status(404).json({
        message: `Subscription with code ${req.params.id} was not found`,
      });
    }
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.message.includes("code")) {
      res
        .status(500)
        .json({ message: "Subscription with the same code already exists" });
    } else {
      res.status(500).json({
        message: "Failed to update subscription",
        error: error.message,
      });
    }
  }
});

module.exports = router;
