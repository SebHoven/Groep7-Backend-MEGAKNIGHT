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
  // tasks?: TaskStudent[];
  groups?: GroupStudent[];
}

interface GroupStudent {
  id?: number;
  createdAt?: Date;
  groupId: number; // reference to Group
  studentId: number; // reference to Student
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
  GroupStudent,
  Battlepass,
  BattlepassReward,
  BattlepassProgress,
  Map,
  MapState,
  User
};
