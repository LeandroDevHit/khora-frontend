import React, { createContext, ReactNode, useContext, useState } from "react";
import { View } from "react-native";
import Alert, { AlertType } from "../components/Alert";

interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
}

interface AlertContextType {
  showAlert: (
    type: AlertType,
    title: string,
    message: string,
    duration?: number
  ) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  closeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    duration = 5000
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newAlert: AlertMessage = { id, type, title, message, duration };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const showSuccess = (title: string, message: string, duration = 5000) => {
    showAlert("success", title, message, duration);
  };

  const showError = (title: string, message: string, duration = 5000) => {
    showAlert("error", title, message, duration);
  };

  const showWarning = (title: string, message: string, duration = 5000) => {
    showAlert("warning", title, message, duration);
  };

  const showInfo = (title: string, message: string, duration = 5000) => {
    showAlert("info", title, message, duration);
  };

  const closeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeAlert,
      }}
    >
      {children}
      <View style={{ position: "absolute", top: 50, left: 0, right: 0 }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            duration={alert.duration}
            onClose={() => closeAlert(alert.id)}
            showIcon={true}
            showCloseButton={true}
          />
        ))}
      </View>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert deve ser utilizado dentro do AlertProvider");
  }
  return context;
};
