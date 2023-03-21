// using nodejs and mongoose create subscription model with fields (coursesId,customerId,createdAt)?
// Import required libraries
const mongoose = require("mongoose");

// Create subscription schema
const subscriptionSchema = new mongoose.Schema({
  code: {
    type: Number,
    unique: true,
  },
  courseId: {
    type: Number,
    required: true,
  },
  customerId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
customersSchema.plugin(AutoIncrement, { inc_field: "code" });

const Subscription = mongoose.model("subscriptions", subscriptionSchema);

module.exports = Subscription;
