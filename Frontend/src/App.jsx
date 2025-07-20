import React from "react";
import Routes from "./Routes";
import { UserProvider } from "./contexts/UserContext";
import { AlertProvider } from "./contexts/AlertContext";

function App() {
  return (
    <AlertProvider>
      <UserProvider>
        <Routes />
      </UserProvider>
    </AlertProvider>
  );
}

export default App;
