import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import About from "./components/about";
import LoginForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";
import Dashboard from './components/dashboard';
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<About />} />
        <Route exact path="/login" element={<LoginForm />}/>
        <Route exact path="/register" element={<SignUpForm />}/>
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};
 
export default App;