import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  nickname: string;
  createdAt: string;
  lastLogin: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (nickname: string) => void;
  logout: () => void;
  updateNickname: (nickname: string) => void;
}

// Helper functions
const USERS_STORAGE_KEY = 'clicker_battleship_users';
const CURRENT_USER_KEY = 'clicker_battleship_current_user';

const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    if (users) {
      return JSON.parse(users);
    }
  } catch (error) {
    console.error('Failed to get users:', error);
  }
  return [];
};

const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Failed to save current user:', error);
  }
};

const getCurrentUser = (): User | null => {
  try {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      return JSON.parse(currentUser);
    }
  } catch (error) {
    console.error('Failed to get current user:', error);
  }
  return null;
};

// Create context
export const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  updateNickname: () => {},
});

// Context provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Initialize user from localStorage on app load
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (nickname: string) => {
    const users = getUsers();
    
    // Check if a user with this nickname already exists
    let existingUser = users.find(u => u.nickname === nickname);
    
    if (existingUser) {
      // Update last login time
      existingUser.lastLogin = new Date().toISOString();
      saveUsers(users);
      
      // Set as current user
      setUser(existingUser);
      saveCurrentUser(existingUser);
    } else {
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        nickname,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // Add to users list
      users.push(newUser);
      saveUsers(users);
      
      // Set as current user
      setUser(newUser);
      saveCurrentUser(newUser);
    }
    
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    saveCurrentUser(null);
  };

  const updateNickname = (nickname: string) => {
    if (!user) return;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      // Update nickname
      users[userIndex].nickname = nickname;
      saveUsers(users);
      
      // Update current user
      const updatedUser = { ...user, nickname };
      setUser(updatedUser);
      saveCurrentUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, updateNickname }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUser = () => useContext(UserContext); 