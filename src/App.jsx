import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import StudentDashboard from './components/StudentDashboard'
import ResultsPage from './components/ResultsPage'
import Settings from './components/Settings'
import Contact from './components/Contact'
import { apiService } from './services/apiService'

// Authentication bypassed - all routes are now public
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = apiService.isAuthenticated();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App