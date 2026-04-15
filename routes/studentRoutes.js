const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('departmentId', 'name')
      .sort({ rollNumber: 1 })
    res.json({ success: true, data: students })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Get students by course
router.get('/course/:courseId', async (req, res) => {
  try {
    let students = await Student.find({
      courseIds: req.params.courseId,
      isActive: true
    }).sort({ rollNumber: 1 })

    // If no students enrolled in this course yet
    // return all active students as fallback
    if (students.length === 0) {
      students = await Student.find({ isActive: true })
        .sort({ rollNumber: 1 })
    }

    res.json({ success: true, data: students })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Create student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body)
    // Update totalStudents count on course
    if (req.body.courseIds?.length) {
      const Course = require('../models/Course')
      await Course.updateMany(
        { _id: { $in: req.body.courseIds } },
        { $inc: { totalStudents: 1 } }
      )
    }
    res.status(201).json({ success: true, data: student })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: student })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Enroll all students into a course at once
router.post('/enroll-all/:courseId', async (req, res) => {
  try {
    const result = await Student.updateMany(
      { isActive: true },
      { $addToSet: { courseIds: req.params.courseId } }
    )
    res.json({ success: true, message: `${result.modifiedCount} students enrolled` })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Delete (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'Student removed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
