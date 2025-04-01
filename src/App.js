import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Avatar from "./pages/Avatar";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import ProtectedRoute from "./services/ProtectedRoute"; 
import "./App.css";
import AdminPanel from "./pages/Admin";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <div style={{ padding: isLoginPage ? "0px" : "0px 20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/suggestions" element={<AdminPanel />} />
                  <Route path="/avatar" element={<Avatar />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
      <ToastContainer position="top-right" autoClose={3000} />
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
