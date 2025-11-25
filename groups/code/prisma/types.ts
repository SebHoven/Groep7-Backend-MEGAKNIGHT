interface Teacher {
  id?: number;
  createdAt?: Date;
  name: string;
  email: string;
}

interface Group {
  id?: number;
  createdAt?: Date;
  name: string;
  teacherId: number; // reference to Teacher
}

interface Student {
  id?: number;
  createdAt?: Date;
  name: string;
  loginCode: string; // used instead of email/password
  groupId: number;   // reference to Group
}

interface Task {
  id?: number;
  createdAt?: Date;
  name: string;
  description: string;
  date: Date;
  icon: string;
  xp: number;
  coordinates: number;
  teacherId: number; // reference to Teacher
}

export { Teacher, Group, Student, Task };
