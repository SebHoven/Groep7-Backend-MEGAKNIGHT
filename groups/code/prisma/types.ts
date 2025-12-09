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
  students?: GroupStudent[];
}
 
interface Student {
  id?: number;
  createdAt?: Date;
  name: string;
  loginCode: string; // used instead of email/password
  groupId: number;   // reference to Group
  tasks?: TaskStudent[];
  gropus?: GroupStudent[];
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
  tasksteps?: TaskStep[];
  students?: TaskStudent[];
}

interface TaskStep {
  id?: number;
  createdAt?: Date;
  text: string;
  completed: boolean;
  taskId: number; // reference to Task
}

interface GroupStudent {
  id?: number;
  createdAt?: Date;
  groupId: number; // reference to Group
  studentId: number; // reference to Student
}

interface TaskStudent {
  id?: number;
  createdAt?: Date;
  taskId: number; // reference to Task
  studentId: number; // reference to Student
}

export { Teacher, Group, Student, Task, TaskStep, GroupStudent, TaskStudent };
