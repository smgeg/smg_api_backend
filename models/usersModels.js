const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const usersSchema = mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter a code"],
  },
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  username: {
    type: String,
    required: [true, "Please enter a Username"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  role: {
    type: String,
    required: [true, "Please enter a role"],
  },
});

usersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
const User = mongoose.model("users", usersSchema);

const validate = (data) => {
  const schema = Joi.object({
    code: Joi.string().label("Code"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Email"),
    phone: Joi.string().required().label("Phone"),
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().required().label("Role"),
    type: Joi.string().label("Type"),
    governorate: Joi.string().label("Governorate"),
    region: Joi.string().label("Governorate"),
    region: Joi.string().label("Governorate"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
