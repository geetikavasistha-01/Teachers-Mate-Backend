const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  semester: { type: Number, required: true },
  batch: { type: String, required: true },
  academicYear: { type: String, required: true },
  totalStudents: { type: Number, default: 0 },
  facultyId: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Course', CourseSchema)
