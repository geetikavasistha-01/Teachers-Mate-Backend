const express = require('express')
const router = express.Router()
const Department = require('../models/Department')

// Get all
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 })
    res.json({ success: true, data: departments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Create
router.post('/', async (req, res) => {
  try {
    const dept = await Department.create(req.body)
    res.status(201).json({ success: true, data: dept })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Department deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
