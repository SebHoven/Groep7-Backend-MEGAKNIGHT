import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'

async function main() {

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
      },
      tasks: {
        create : [
          {
            name: 'kan je koppen??',
            description: 'rode kaart pakken',
            date: new Date(2025, 6, 4),
            icon: '🫃🟥',
            xp: 67,
            coordinates: 35.4
          }
        ]
      }
    }
  })

  // Create some unassigned students (not in any group yet)
  // Note: Don't explicitly set groupId, let it default to null
  const unassignedStudents = await prisma.student.createMany({
    data: [
      { name: "Emma Wilson", loginCode: "EW111" },
      { name: "Oliver Davis", loginCode: "OD222" },
      { name: "Sophia Martinez", loginCode: "SM333"},
      { name: "Lucas Garcia", loginCode: "LG444"},
      { name: "Mia Rodriguez", loginCode: "MR555" }
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

  console.log("Seeded teacher with groups and students:", teacher);
  console.log("Created unassigned students:", unassignedStudents);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })