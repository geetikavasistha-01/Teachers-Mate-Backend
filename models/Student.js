const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  rollNumber:   { type: String, required: true, unique: true },
  email:        { type: String },
  section:      { type: String },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  semester:     { type: Number, required: true },
  batch:        { type: String },
  courseIds:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isActive:     { type: Boolean, default: true },
  attendanceHistory: [{
    date: String,
    status: String,
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
  }],
  // AI features
  attendanceStats: {
    totalClasses: { type: Number, default: 0 },
    presentCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
    lateCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  }
}, { timestamps: true })

// Indexes for performance
StudentSchema.index({ rollNumber: 1 })
StudentSchema.index({ departmentId: 1, semester: 1, section: 1 })
StudentSchema.index({ isActive: 1 })

module.exports = mongoose.model('Student', StudentSchema)
