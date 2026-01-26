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
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "password123",
      groups: {
        create: [
          {
            name: "Math Group",
            students: {
              create: [
                { name: "John Doe", loginCode: "JD123" },
                { name: "Jane Smith", loginCode: "JS456" }
              ]
            }
          },
          {
            name: "Science Group",
            students: {
              create: [
                { name: "Tom Brown", loginCode: "TB789" },
                { name: "Sara White", loginCode: "SW101" }
              ]
            }
          }
        ]
      }
    },
    include: {
      groups: {
        include: {
          students: true
        }
      }
    }
  })

  const studentsToAssign = [
    teacher.groups[0].students[0],
    teacher.groups[0].students[1],
    teacher.groups[1].students[0]
  ]

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
      { name: "Emma Wilson", loginCode: "EW111", groupId: 1 },
      { name: "Oliver Davis", loginCode: "OD222", groupId: 1 },
      { name: "Sophia Martinez", loginCode: "SM333", groupId: 1 },
      { name: "Lucas Garcia", loginCode: "LG444", groupId: 1 },
      { name: "Mia Rodriguez", loginCode: "MR555", groupId: 1 }
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
  const students = teacher.groups.flatMap(group => group.students);

  await prisma.battlepassProgress.createMany({
    data: students.map((student, index) => ({
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