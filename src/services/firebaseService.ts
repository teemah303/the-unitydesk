import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { FirestoreStaff, Task, Department } from '../types/firebase';

// ==================== STAFF SERVICES ====================

export const staffService = {
  // Get all staff for a specific department
  async getStaffByDepartment(department: string): Promise<FirestoreStaff[]> {
    const staffRef = collection(db, 'staff');
    const q = query(staffRef, where('department', '==', department));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreStaff[];
  },

  // Get single staff member
  async getStaffById(id: string): Promise<FirestoreStaff | null> {
    const docRef = doc(db, 'staff', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreStaff;
    }
    return null;
  },

  // Add new staff member
  async addStaff(staff: Omit<FirestoreStaff, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const staffRef = collection(db, 'staff');
    const docRef = await addDoc(staffRef, {
      ...staff,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  },

  // Update staff member
  async updateStaff(id: string, data: Partial<FirestoreStaff>): Promise<void> {
    const docRef = doc(db, 'staff', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  // Delete staff member
  async deleteStaff(id: string): Promise<void> {
    const docRef = doc(db, 'staff', id);
    await deleteDoc(docRef);
  },

  // Real-time staff listener
  subscribeToStaff(department: string, callback: (staff: FirestoreStaff[]) => void) {
    const staffRef = collection(db, 'staff');
    const q = query(staffRef, where('department', '==', department));
    
    return onSnapshot(q, (snapshot) => {
      const staffList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreStaff[];
      callback(staffList);
    });
  }
};

// ==================== TASK SERVICES ====================

export const taskService = {
  // Get tasks for staff member
  async getTasksByStaff(staffId: string): Promise<Task[]> {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('assignedTo', '==', staffId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  },

  // Get tasks by department
  async getTasksByDepartment(department: string): Promise<Task[]> {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('department', '==', department));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  },

  // Create new task
  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...task,
      createdAt: Timestamp.now()
    });
    
    return docRef.id;
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const docRef = doc(db, 'tasks', taskId);
    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completedAt = Timestamp.now();
    }
    
    await updateDoc(docRef, updateData);
  }
};

// ==================== AUTHENTICATION SERVICES ====================

export const authService = {
  // Get current user data
  async getCurrentUserData(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(userId: string, data: any) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }
};

// ==================== STORAGE SERVICES ====================

export const storageService = {
  // Upload profile photo
  async uploadProfilePhoto(file: File, userId: string): Promise<string> {
    const storageRef = ref(storage, `profile-photos/${userId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Upload task attachment
  async uploadTaskAttachment(file: File, taskId: string): Promise<string> {
    const storageRef = ref(storage, `task-attachments/${taskId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
};

// ==================== DEPARTMENT SERVICES ====================

export const departmentService = {
  // Get all departments
  async getDepartments(): Promise<Department[]> {
    const deptRef = collection(db, 'departments');
    const snapshot = await getDocs(deptRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Department[];
  },

  // Get department by HOD
  async getDepartmentByHOD(hodId: string): Promise<Department | null> {
    const deptRef = collection(db, 'departments');
    const q = query(deptRef, where('hodId', '==', hodId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Department;
  }
};