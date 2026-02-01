interface Task {
  id?: number;
  createdAt?: Date;
  name: string;
  description: string;
  date: Date;
  icon: string;
  xp: number;
  completed?: boolean;
  teacherId: number; // reference to Teacher
  tasksteps?: TaskStep[];
  students?: TaskStudent[];
  x?: number;
  y?: number;
}

interface TaskStep {
  id?: number;
  createdAt?: Date;
  text: string;
  completed: boolean;
  taskId: number; // reference to Task
}

interface TaskStudent {
  id?: number;
  createdAt?: Date;
  taskId: number; // reference to Task
  studentId: number; // reference to Student
}

export { Task, TaskStep, TaskStudent };