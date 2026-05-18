const sequelize = require("../config/database")

const {
  Class,
  Student,
  Subject,
  Schedule,
  Note
} = require("../models")

async function seed() {
  try {

    // =========================
    // RESET
    // =========================
    await sequelize.sync({ force: true })

    console.log("✅ Database reset")

    // =========================
    // CLASSES
    // =========================
    const class1 = await Class.create({ name: "1A" })
    const class2 = await Class.create({ name: "1B" })
    const class3 = await Class.create({ name: "2A" })

    // =========================
    // STUDENTS
    // =========================
    const students = await Student.bulkCreate([
      { name: "Ahmed Ben Ali", classId: class1.id },
      { name: "Sarra Khaled", classId: class1.id },

      { name: "Youssef Trabelsi", classId: class2.id },
      { name: "Mariem Ayari", classId: class2.id },

      { name: "Omar Gharbi", classId: class3.id },
      { name: "Lina Ben Salem", classId: class3.id }
    ])

    // =========================
    // SUBJECTS
    // =========================
    const math = await Subject.create({
      name: "Math",
      classId: class1.id
    })

    const physics = await Subject.create({
      name: "Physics",
      classId: class1.id
    })

    const english = await Subject.create({
      name: "English",
      classId: class2.id
    })

    const science = await Subject.create({
      name: "Science",
      classId: class3.id
    })

    // =========================
    // SCHEDULE
    // =========================
    await Schedule.bulkCreate([
      {
        day: "Monday",
        startTime: "08:00",
        endTime: "10:00",
        classId: class1.id,
        subjectId: math.id
      },
      {
        day: "Monday",
        startTime: "10:00",
        endTime: "12:00",
        classId: class1.id,
        subjectId: physics.id
      },
      {
        day: "Tuesday",
        startTime: "08:00",
        endTime: "10:00",
        classId: class2.id,
        subjectId: english.id
      },
      {
        day: "Wednesday",
        startTime: "14:00",
        endTime: "16:00",
        classId: class3.id,
        subjectId: science.id
      }
    ])

    // =========================
    // NOTES
    // =========================
    await Note.bulkCreate([
      {
        studentId: students[0].id,
        subjectId: math.id,
        ds: 15,
        exam: 17
      },
      {
        studentId: students[1].id,
        subjectId: physics.id,
        ds: 14,
        exam: 16
      },
      {
        studentId: students[2].id,
        subjectId: english.id,
        ds: 18,
        exam: 19
      },
      {
        studentId: students[3].id,
        subjectId: english.id,
        ds: 12,
        exam: 14
      }
    ])

    console.log("🚀 Fake data inserted successfully")

    process.exit()

  } catch (error) {
    console.error(error)
  }
}

seed()