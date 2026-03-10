import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: 'user' | 'admin';
    status: 'pending' | 'approved';
    geminiApiKey?: string;
    lastActive?: number;
    createdAt: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Fetch or create user data in Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                const now = Date.now();

                if (userSnap.exists()) {
                    setUserData(userSnap.data() as UserData);
                    // Update lastActive when they login/auth state changes
                    updateDoc(userRef, { lastActive: now }).catch(e => console.error("Error updating lastActive", e));
                } else {
                    // New user, create document with pending status
                    const newUserData: Partial<UserData> = {
                        uid: currentUser.uid,
                        email: currentUser.email || '',
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || '',
                        role: 'user', // Default role
                        status: 'pending', // Default status, requires admin approval
                        lastActive: now,
                        createdAt: serverTimestamp(),
                    };

                    await setDoc(userRef, newUserData);
                    // Re-fetch to get the exact saved data or just set state
                    setUserData(newUserData as UserData);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        // Set up periodic updating of lastActive (e.g., every 1 minute)
        const intervalId = setInterval(() => {
            if (auth.currentUser) {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                updateDoc(userRef, { lastActive: Date.now() }).catch(e => console.warn('Failed to update online status', e));
            }
        }, 60000); // 1 minute

        return () => {
            unsubscribe();
            clearInterval(intervalId);
        };
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
