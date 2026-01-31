import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'

async function main() {

  // Create a battlepass
  const battlepass = await prisma.battlepass.create({
    data: {
      name: "Season 1",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-01")
    }
  });

  // Create a teacher
  const teacher = await prisma.teacher.create({
    data: {
      name: "Alice Johnson"
    }
  })

  // Create groups for the teacher
  const group1 = await prisma.group.create({
    data: {
      name: "Math Group",
      teacherId: teacher.id
    }
  })

  const group2 = await prisma.group.create({
    data: {
      name: "Science Group",
      teacherId: teacher.id
    }
  })

  // Create students for Math Group
  const student1 = await prisma.student.create({
    data: { name: "John Doe", groupId: group1.id }
  })
  const student2 = await prisma.student.create({
    data: { name: "Jane Smith", groupId: group1.id }
  })

  // Create students for Science Group
  const student3 = await prisma.student.create({
    data: { name: "Tom Brown", groupId: group2.id }
  })
  const student4 = await prisma.student.create({
    data: { name: "Sara White", groupId: group2.id }
  })

  const task = await prisma.task.create({
    data: {
      name: 'kan je koppen??',
      description: 'rode kaart pakken',
      date: new Date(2025, 6, 4),
      icon: '🫃🟥',
      xp: 67,
      teacherId: teacher.id,
      tasksteps: {
        create: [
          {
            text: 'Ga naar het veld',
            completed: false
          },
          {
            text: 'Pak de rode kaart',
            completed: false
          },
          {
            text: 'Koppen',
            completed: false
          }
        ]
      },
      x: 150,
      y: 300
    },
  })

  const studentsToAssign = [student1, student2, student3]

  for (const student of studentsToAssign) {
    await prisma.taskStudent.create({
      data: {
        taskId: task.id,
        studentId: student.id
      }
    })
  }

  // Create some unassigned students (not in any group yet)
  // Note: Don't explicitly set groupId, let it default to null
  const unassignedStudents = await prisma.student.createMany({
    data: [
      { name: "Emma Wilson", groupId: group1.id },
      { name: "Oliver Davis", groupId: group1.id },
      { name: "Sophia Martinez", groupId: group2.id },
      { name: "Lucas Garcia", groupId: group2.id },
      { name: "Mia Rodriguez", groupId: null }
    ]
  })

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create a user for login
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User"
    }
  })

  // Get students and assign BattlepassProgress
  const students = [student1, student2, student3, student4];

  await prisma.battlepassProgress.createMany({
    data: students.map((student: any, index: number) => ({
      studentId: student.id,
      battlepassId: battlepass.id,

      // Random xp and levels
      level: Math.floor(index / 2) + 1,
      xp: 100 + index * 50
    }))
  });

  console.log("Seeded teacher with groups and students:", teacher)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })