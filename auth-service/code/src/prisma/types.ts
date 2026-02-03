interface User {
  id?: string;
  email: string;
  password: string;
  name?: string;
  role: string; // "student" or "teacher"
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Student {
  id?: number;
  createdAt?: Date;
  name: string;
  groupId?: number; // Made optional
  userId?: string; // Link to User
}

interface Teacher {
  id?: number;
  createdAt?: Date;
  name?: string;
  userId?: string; // Link to User
}

export { User, Student, Teacher };