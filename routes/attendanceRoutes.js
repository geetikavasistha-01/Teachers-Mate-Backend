const express = require('express')
const router = express.Router()
const Attendance = require('../models/Attendance')
const Student = require('../models/Student')

// 1. Mark/save attendance for a course on a specific date
router.post('/mark', async (req, res) => {
  try {
    const { courseId, date, records } = req.body

    if (!courseId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'courseId, date and records array are required'
      })
    }

    // Delete existing records for this course+date then re-insert
    await Attendance.deleteMany({ courseId, date })

    const inserted = await Attendance.insertMany(
      records.map(r => ({
        courseId,
        date,
        studentId: r.studentId,
        status: r.status || 'present'
      }))
    )

    res.json({ success: true, data: inserted, message: 'Attendance saved successfully' })
  } catch (err) {
    console.error('Mark attendance error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})

// 2. Get all dates attendance was marked for a course
router.get('/history/:courseId', async (req, res) => {
  try {
    const dates = await Attendance.distinct('date', {
      courseId: req.params.courseId
    })

    // Sort latest date first
    dates.sort((a, b) => new Date(b) - new Date(a))

    res.json({ success: true, data: dates })
  } catch (err) {
    console.error('History fetch error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})

// 3. Get per-student attendance summary for a course
router.get('/summary/:courseId', async (req, res) => {
  try {
    // Show all active students for any course (not just enrolled ones)
    const students = await Student.find({
      isActive: true
    }).sort({ rollNumber: 1 })

    if (students.length === 0) {
      return res.json({ success: true, data: [] })
    }

    const summary = await Promise.all(
      students.map(async (student) => {
        const total = await Attendance.countDocuments({
          courseId: req.params.courseId,
          studentId: student._id
        })
        const present = await Attendance.countDocuments({
          courseId: req.params.courseId,
          studentId: student._id,
          status: 'present'
        })
        const late = await Attendance.countDocuments({
          courseId: req.params.courseId,
          studentId: student._id,
          status: 'late'
        })
        const absent = total - present - late
        const percentage = total === 0
          ? 0
          : Math.round(((present + late) / total) * 100)

        return {
          student: {
            _id: student._id,
            name: student.name,
            rollNumber: student.rollNumber
          },
          total,
          present,
          absent,
          late,
          percentage
        }
      })
    )

    res.json({ success: true, data: summary })
  } catch (err) {
    console.error('Summary fetch error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})

// 4. Get attendance records for a course on a specific date
// MUST BE LAST - dynamic route would match /history and /summary if placed first
router.get('/:courseId/:date', async (req, res) => {
  try {
    const records = await Attendance.find({
      courseId: req.params.courseId,
      date: req.params.date
    }).populate('studentId', 'name rollNumber')

    res.json({ success: true, data: records })
  } catch (err) {
    console.error('Date records fetch error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
