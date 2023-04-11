const mongoose = require("mongoose");

// Create subscription schema
const subscriptionsSchema = new mongoose.Schema({
  code: {
    type: Number,
    unique: true,
  },
  course_code: {
    type: Number,
    required: true,
  },
  customer_code: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

subscriptionsSchema.pre("save", async function (next) {
  const subscription = this;
  if (subscription.isNew) {
    const lastSubscription = await Subscriptions.findOne().sort({ code: -1 });
    if (lastSubscription) {
      subscription.code = lastSubscription.code + 1;
    } else {
      subscription.code = 1;
    }
  }
  next();
});
const Subscriptions = mongoose.model("subscriptions", subscriptionsSchema);

const validate = (data) => {
  const schema = Joi.object({
    course_code: Joi.string().required().label("course_code"),
    customer_code: Joi.string().required().label("customer_code"),
  });
  return schema.validate(data);
};

module.exports = { Subscriptions, validate };
