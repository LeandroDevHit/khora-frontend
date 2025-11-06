import React, { useState } from "react";
import { StatusBar } from "react-native";
import Home from "./home";
import Login from "./login";
import Quest from "./quest";

export default function App() {
  // Estado global de login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Função chamada quando o usuário termina o Quest
  const finishQuest = () => {
    setIsNewUser(false); // Sai do Quest e vai para Home
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {!isLoggedIn ? (
        // Se não está logado, mostra a tela de login
        <Login setIsLoggedIn={setIsLoggedIn} setIsNewUser={setIsNewUser} />
      ) : isNewUser ? (
        // Se é um usuário novo, entra no Quest
        <Quest onFinish={finishQuest} />
      ) : (
        // Se não é novo, entra no Home
        <Home />
      )}
    </>
  );
}
