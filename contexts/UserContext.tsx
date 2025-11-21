import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextProps {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  userId: string | null; // Adiciona o userId
  setUserId: (id: string | null) => void; // Adiciona o setter para userId
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Adiciona o estado para userId

  return (
    <UserContext.Provider
      value={{ userEmail, setUserEmail, userId, setUserId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
