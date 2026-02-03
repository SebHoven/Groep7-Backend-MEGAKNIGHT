import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LoginController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          student: true,
          teacher: true
        }
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Sync to groups service on login (for existing users created before sync was implemented)
      try {
        const GROUPS_SERVICE_URL = process.env.GROUPS_SERVICE_URL || 'http://groups:3012';
        const syncEndpoint = user.role === 'student' ? '/students/sync' : '/teachers/sync';
        const syncUrl = `${GROUPS_SERVICE_URL}${syncEndpoint}`;
        const syncData = {
          userId: user.id,
          name: user.name
        };
        
        console.log('🔄 Attempting to sync to groups service...');
        console.log('URL:', syncUrl);
        console.log('Data:', syncData);
        
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncData)
        });
        
        const responseData = await response.json();
        console.log('✅ Sync response:', response.status, responseData);
      } catch (syncError) {
        console.error('❌ Failed to sync to groups service on login:', syncError);
        // Don't fail login if sync fails
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            student: user.student,
            teacher: user.teacher
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during login'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during logout'
      });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true, student: true, teacher: true }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          student: user.student,
          teacher: user.teacher
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }
}

export default new LoginController();