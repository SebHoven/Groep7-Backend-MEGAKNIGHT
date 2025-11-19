import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
      }
    }
  })

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