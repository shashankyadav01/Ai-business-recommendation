import { useState } from "react";

import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import FormFillingPage from "./pages/FormFillingPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [formFilled, setFormFilled] =
    useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [recommendedCompanies,
    setRecommendedCompanies] = useState([]);

  const handleLogin = () => {
    localStorage.removeItem("userProfile");

    setFormFilled(false);
    setIsLoggedIn(true);
  };

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : !formFilled ? (
        <FormFillingPage
          onFormSubmit={() =>
            setFormFilled(true)
          }
        />
      ) : selectedCompany ? (
        <CompanyDetailPage
          company={selectedCompany}
          recommendations={
            recommendedCompanies
          }
          onBack={() =>
            setSelectedCompany(null)
          }
        />
      ) : (
        <ChatPage
          onCompanyClick={(
            company,
            recommendations
          ) => {
            setSelectedCompany(company);
            setRecommendedCompanies(
              recommendations
            );
          }}
        />
      )}
    </>
  );
}

export default App;