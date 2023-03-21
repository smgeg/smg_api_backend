// create mongoose model with fields (title,desc,img,price,no_of_lec,no_of_hours,location,isOnline) with validation by joi?```
const mongoose = require("mongoose");
const Joi = require("joi");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  no_of_lec: {
    type: Number,
    required: true,
  },
  no_of_hours: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

function validateCourse(course) {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    img: Joi.string().required(),
    price: Joi.number().required(),
    no_of_lec: Joi.number().required(),
    no_of_hours: Joi.number().required(),
    location: Joi.string().required(),
    isOnline: Joi.boolean().required(),
  });
  return schema.validate(course);
}

module.exports.Course = Course;
module.exports.validate = validateCourse;
