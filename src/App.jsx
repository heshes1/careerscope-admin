import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Experiences from './pages/Experiences'
import Analytics from './pages/Analytics'
import AuditLog from './pages/AuditLog'
import RequireAuth from './components/RequireAuth'

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<RequireAuth><Experiences/></RequireAuth>} />
      <Route path="/analytics" element={<RequireAuth><Analytics/></RequireAuth>} />
      <Route path="/audit" element={<RequireAuth><AuditLog/></RequireAuth>} />
      <Route path="*" element={<RequireAuth><Experiences/></RequireAuth>} />
    </Routes>
  )
}
