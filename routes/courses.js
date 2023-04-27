const router = require("express").Router();
const { Courses, validate, newCode } = require("../models/coursesModels");
const Joi = require("joi");

router.get("/", async (req, res) => {
  try {
    const allCourses = await Courses.find();
    res.status(200).send(allCourses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.get("/newcode", async (req, res) => {
  try {
    const maxCode = await Courses.findOne().sort("-code").exec();
    const newCode = ((maxCode && maxCode.code) || 0) + 1;
    res.status(200).json({ new_code: newCode });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const oneCourse = await Courses.findOne({ code: req.params.id });
    console.log(oneCourse);
    if (oneCourse) {
      res.status(200).json({ data: oneCourse });
    } else {
      res
        .status(404)
        .json({ message: `Course with code ${req.params.id} was not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});




// POST a new course
router.post("/", async (req, res) => {
  try {
    const newCourse = new Courses(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json({ data: savedCourse });
  } catch (error) {
    console.error(error);
    if (error.error === 11000) {
      res.status(500).json({ message: "Code is exists" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to create course", error: error.error });
    }
  }
});

// DELETE a course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Courses.findOneAndDelete({
      code: req.params.id,
    });
    if (deletedCourse) {
      res
        .status(200)
        .json({ message: "Course deleted successfully", data: deletedCourse });
    } else {
      res
        .status(404)
        .json({ message: `Course with code ${req.params.id} was not found` });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete course", error: error.message });
  }
});

// PATCH an existing course
router.patch("/:id", async (req, res) => {
  try {
    const updatedCourse = await Courses.findOneAndUpdate(
      { code: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (updatedCourse) {
      res
        .status(200)
        .json({ message: "Course updated successfully", data: updatedCourse });
    } else {
      res
        .status(404)
        .json({ message: `Course with code ${req.params.id} was not found` });
    }
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.message.includes("code")) {
      res.status(500).json({
        message: "Course with the same code already exists",
        detail: error.message,
      });
    } else {
      res
        .status(500)
        .json({ message: "Failed to update course", error: error });
    }
    //res.status(500).json({ message: "Failed to update course", error: error });
  }
});

module.exports = router;
