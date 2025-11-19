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

export { Teacher, Group, Student };
