import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from './theme';
import Header from './components/Header';
import Home from './pages/Home';
import Report from './pages/Report';
import Status from './pages/Status';
import Takedowns from './pages/Takedowns';
import Admin from './pages/Admin';
import Login from './components/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<Report />} />
                <Route path="/status" element={<Status />} />
                <Route path="/takedowns" element={<Takedowns />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
