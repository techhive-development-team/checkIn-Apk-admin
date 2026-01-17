// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import "./index.css";
// import Users from "./pages/users/user";
// import Company from "./pages/Company/Company";
// import CompanyCreate from "./pages/Company/Create/CompanyCreate";
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/user" element={<Users />} />
//         <Route path="/company" element={<Company/>} />
//         <Route path="/company/create" element={<CompanyCreate/>} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)