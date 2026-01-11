interface Teacher {
  id?: number;
  createdAt?: Date;
  name?: string;
  userId?: string; // Link to User
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
  groupId?: number; // Made optional
  userId?: string; // Link to User
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
interface Map {
  id?: number;
  createdAt?: Date;
  name: string;
  imageUrl: string;
  states?: MapState[];
}
interface MapState {
  id?: number;
  createdAt?: Date;
  zoom: number;
  positionX: number;
  positionY: number;
  mapId: number; // reference to Map
  map?: Map;
}

interface User {
  id?: string;
  email: string;
  password: string;
  name?: string;
  role: string; // "student" or "teacher"
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  teacher?: Teacher;
  student?: Student;
}

export {
  Teacher,
  Group,
  Student,
  Task,
  TaskStep,
  GroupStudent,
  TaskStudent,
  Avatar,
  AvatarHasItem,
  AvatarItem,
  Battlepass,
  BattlepassReward,
  BattlepassProgress,
  Map,
  MapState,
  User
};
