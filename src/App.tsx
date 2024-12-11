import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import Details from './pages/Details'
import Edit from './pages/Edit'
import Home from './pages/Home'

import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  )
}

export default App
