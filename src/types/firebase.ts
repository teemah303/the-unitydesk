// Staff interface for Firestore
export interface FirestoreStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  tasksAssigned: number;
  tasksCompleted: number;
  performance: number;
  profilePhoto?: string;
  qualifications: string[];
  skills: string[];
  lastActive: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // HOD's UID
}

// User interface
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'hod' | 'staff' | 'admin';
  department?: string;
  phoneNumber?: string;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Staff ID
  assignedBy: string; // HOD ID
  department: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: Date;
  completedAt?: Date;
  attachments?: string[]; // URLs to storage
}

// Department interface
export interface Department {
  id: string;
  name: string;
  hodId: string;
  staffCount: number;
  createdAt: Date;
}