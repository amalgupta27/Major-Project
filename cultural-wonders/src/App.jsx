import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Heritage from './pages/Heritage';
import Arts from './pages/Arts';
import Festivals from './pages/Festivals';
import Cuisines from './pages/Cuisines';
import Crafts from './pages/Crafts';
import About from './pages/About';
import Quiz from './pages/Quiz';
import States from './pages/States';
import StateDetail from './pages/StateDetail';
import Chat from './pages/Chat';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demonstration; replace with real async logic as needed
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="App">
        {loading && <Loader />}
        <Navbar />
        <main className="main-content" style={loading ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/heritage" element={<Heritage />} />
            <Route path="/arts" element={<Arts />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/cuisines" element={<Cuisines />} />
            <Route path="/crafts" element={<Crafts />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/states" element={<States />} />
            <Route path="/state/:id" element={<StateDetail />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
