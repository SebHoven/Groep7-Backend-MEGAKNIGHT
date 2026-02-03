import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RegisterController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, name, role } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Validate role
      const validRoles = ['student', 'teacher'];
      const userRole = role && validRoles.includes(role) ? role : 'student';

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await prisma.user.create({
  data: {
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name,
    role: role, // "student" or "teacher"
    // Automatically create Student or Teacher record based on role
    ...(role === "student" && {
      student: {
        create: {
          name: name
        }
      }
    }),
    ...(role === "teacher" && {
      teacher: {
        create: {
          name: name
        }
      }
    })
  },
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    student: true,
    teacher: true
  }
});

      // Sync to groups service
      try {
        const GROUPS_SERVICE_URL = process.env.GROUPS_SERVICE_URL || 'http://groups:3012';
        const syncEndpoint = role === 'student' ? '/students/sync' : '/teachers/sync';
        
        await fetch(`${GROUPS_SERVICE_URL}${syncEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: newUser.id,
            name: newUser.name
          })
        });
      } catch (syncError) {
        console.error('Warning: Failed to sync to groups service:', syncError);
        // Don't fail registration if sync fails
      }

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during registration'
      });
    }
  }
}

export default new RegisterController();