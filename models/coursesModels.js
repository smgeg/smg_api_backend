// create mongoose model with fields (title,desc,img,price,no_of_lec,no_of_hours,location,isOnline) with validation by joi?```
const mongoose = require("mongoose");
const Joi = require("joi");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Subscriptions } = require("./subscriptionModels");
const coursesSchema = new mongoose.Schema({
  code: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  no_of_lec: {
    type: Number,
  },
  no_of_hours: {
    type: Number,
  },
  location: {
    type: String,
  },
  isOnline: {
    type: Boolean,
  },
});
coursesSchema.pre("save", async function (next) {
  const course = this;
  if (course.isNew) {
    const lastCourse = await Courses.findOne().sort({ code: -1 });
    if (lastCourse) {
      course.code = lastCourse.code + 1;
    } else {
      course.code = 1;
    }
  }
  next();
});

coursesSchema.pre("findOneAndDelete", async function (next) {
  const course = this.getQuery();
  const subscriptions = await Subscriptions.find({
    course_code: course.code,
  });
  if (subscriptions.length > 0) {
    const error = new Error(
      "Cannot delete course with associated subscriptions"
    );
    return next(error);
  }
  next();
});
// courseSchema.plugin(AutoIncrement, {
//   id: "course_code_seq",
//   inc_field: "code",
//   start_seq: 1,
// });
const Courses = mongoose.model("courses", coursesSchema);

function validate(course) {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string(),
    img: Joi.string(),
    price: Joi.number(),
    no_of_lec: Joi.number(),
    no_of_hours: Joi.number(),
    location: Joi.string(),
    isOnline: Joi.boolean(),
  });
  return schema.validate(course);
}

module.exports.Courses = Courses;
module.exports.validate = validate;
