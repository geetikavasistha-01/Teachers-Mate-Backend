const express = require('express')
const router = express.Router()
const Course = require('../models/Course')

// Get all with department populated
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('departmentId', 'name code').sort({ createdAt: -1 })
    res.json({ success: true, data: courses })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('departmentId', 'name code')
    res.json({ success: true, data: course })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Create
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body)
    res.status(201).json({ success: true, data: course })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: course })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Course deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
