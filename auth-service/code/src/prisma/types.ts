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

export { User };