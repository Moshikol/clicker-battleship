import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  createdAt: Date;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (name: string) => void;
  logout: () => void;
  updateUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUserName: () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = 'clicker_battleship_user';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          parsedUser.createdAt = new Date(parsedUser.createdAt);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Create or login user
  const login = async (name: string) => {
    try {
      const newUser: User = {
        id: uuidv4(),
        name,
        createdAt: new Date(),
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Failed to login user:', error);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout user:', error);
    }
  };

  // Update user name
  const updateUserName = async (name: string) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, name };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user name:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 