const User = require("./User")
const Student = require("./student")
const Class = require("./class")
const Subject = require("./subject")
const Schedule = require("./schedule")
const Note = require("./note")
const AttackLog = require("./attackLog")
const Notification = require("./notification")

Class.hasMany(Student, {
  foreignKey: "classId"
})

Student.belongsTo(Class, {
  foreignKey: "classId"
})

Class.hasMany(Subject, {
  foreignKey: "classId"
})

Subject.belongsTo(Class, {
  foreignKey: "classId"
})

Class.hasMany(Schedule, {
  foreignKey: "classId"
})

Schedule.belongsTo(Class, {
  foreignKey: "classId"
})

Subject.hasMany(Schedule, {
  foreignKey: "subjectId"
})

Schedule.belongsTo(Subject, {
  foreignKey: "subjectId"
})

Student.hasMany(Note, {
  foreignKey: "studentId"
})

Note.belongsTo(Student, {
  foreignKey: "studentId"
})

Subject.hasMany(Note, {
  foreignKey: "subjectId"
})

Note.belongsTo(Subject, {
  foreignKey: "subjectId"
})

module.exports = {
  User,
  Student,
  Class,
  Subject,
  Schedule,
  Note,
  AttackLog,
  Notification
}