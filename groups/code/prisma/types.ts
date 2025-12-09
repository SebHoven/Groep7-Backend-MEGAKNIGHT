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
  groups?: GroupStudent[];
  avatar?: Avatar[];
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

interface Avatar {
  id?: number;
  createdAt?: Date;
  studentId: number; // reference to Student
  student?: Student;
  avatarHasItem: AvatarHasItem[];
}

interface AvatarHasItem {
  id: number;
  createdAt?: Date;
  avatarId: number; //reference to Avatar
  avatar: Avatar;
  avatarItemId: number; // reference to AvatarItem
  avatarItem: AvatarItem;
}

interface AvatarItem {
  id: number;
  createdAt: Date;
  slot: number;
  name: string;
  texture: string;
  avatarHasItem: AvatarHasItem[];
}

interface Battlepass {
  id: number;
  createdAt: Date;
  name: string;
  startDate: Date;
  endDate: Date;
  reward?: BattlepassReward[]
  progress?: BattlepassProgress[]
}

interface BattlepassReward {
  id: number;
  createdAt: Date;
  level: number;
  avatarItem: AvatarItem;
  avatarItemId: number; // reference to avatarItem
  battlepass: Battlepass;
  battlepassId: number; // reference to battlepass
}

interface BattlepassProgress {
  id: number;
  createdAt: Date;
  xp: number;
  level: number;
  battlepassId: number; //reference to battlepass
  studentId: number; //reference to student
  battlepass: Battlepass;
  student: Student;
}



export { Teacher, Group, Student, Task, TaskStep, GroupStudent, TaskStudent, Avatar, AvatarHasItem, AvatarItem, Battlepass, BattlepassReward, BattlepassProgress };
