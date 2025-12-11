import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const authService = {
  // HOD Sign Up
  async signUpAsHOD(email: string, password: string, name: string, department: string) {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'hod',
        department: department,
        createdAt: new Date().toISOString()
      });
      
      // Create department if not exists
      await setDoc(doc(db, 'departments', department.toLowerCase().replace(/ /g, '-')), {
        name: department,
        hodId: user.uid,
        staffCount: 0,
        createdAt: new Date().toISOString()
      });
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Staff Sign Up (Invited by HOD)
  async signUpAsStaff(email: string, password: string, name: string, department: string, invitedBy: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'staff',
        department: department,
        invitedBy: invitedBy,
        createdAt: new Date().toISOString()
      });
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Reset Password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};