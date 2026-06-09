import { useState } from "react";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import FormFillingPage from "./pages/FormFillingPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [formFilled, setFormFilled] = useState(
    false // Always start as false, will be set to true after form submission
  );

  const handleLogin = () => {
    // Clear old profile data on new login
    localStorage.removeItem("userProfile");
    setFormFilled(false);
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        formFilled ? (
          <ChatPage />
        ) : (
          <FormFillingPage
            onFormSubmit={() => setFormFilled(true)}
          />
        )
      ) : (
        <Login
          onLogin={handleLogin}
        />
      )}
    </>
  );
}

export default App;
