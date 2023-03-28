const Joi = require("joi");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Subscriptions } = require("./subscriptionModels");

const jwt = require("jsonwebtoken");
const customersSchema = mongoose.Schema({
  code: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  phone: {
    type: String,
    required: [true, "Please enter a phone"],
  },
  email: {
    type: String,
    required: [true, "Please enter a email"],
  },
  job: {
    type: String,
    required: [true, "Please enter a job"],
  },
  username: {
    type: String,
    required: [true, "Please enter a Username"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },

  type: {
    type: String,
    required: [true, "Please enter a type"],
  },
  governorate: {
    type: String,
    required: [true, "Please enter a governorate"],
  },
  region: {
    type: String,
    required: [true, "Please enter a region"],
  },

  commercial_registration: {
    type: Number,
    //required: [true, "Please enter a Commercial Registration No"],
  },
  tax_card: {
    type: Number,
    //required: [true, "Please enter a Tax card number"],
  },
});

customersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

customersSchema.pre("save", async function (next) {
  const customer = this;
  if (customer.isNew) {
    const lastCustomer = await Customers.findOne().sort({ code: -1 });
    if (lastCustomer) {
      customer.code = lastCustomer.code + 1;
    } else {
      customer.code = 1;
    }
  }
  next();
});

customersSchema.pre("findOneAndDelete", async function (next) {
  const customer = this.getQuery();
  const subscriptions = await Subscriptions.find({
    customer_code: customer.code,
  });
  if (subscriptions.length > 0) {
    const error = Error("Cannot delete customer with associated subscriptions");
    return next(error);
  }
  next();
});

const Customers = mongoose.model("customers", customersSchema);

const validate = (data) => {
  const schema = Joi.object({
    code: Joi.string().label("Code"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Email"),
    phone: Joi.string().required().label("Phone"),
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
    job: Joi.string().required().label("Job"),

    type: Joi.string().required().label("Type"),
    governorate: Joi.string().required().label("Governorate"),
    region: Joi.string().required().label("Region"),
    commercial_registration: Joi.string().label("Commercial Registration"),
    tax_card: Joi.string().label("Tax Card"),
  });
  return schema.validate(data);
};

module.exports = { Customers, validate };
