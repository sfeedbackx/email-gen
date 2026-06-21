import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { ROUTES } from './utils/constants';
import { Signup } from './components/auth/Signup';
import { Login } from './components/auth/Login';
import Home from './pages/Home';
import { Threads } from './pages/Threads';
import { Meessages } from './pages/Messages';

const AppContent: React.FC = () => {

  return (
    <main className="main-content flex">
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Signup />} />
        <Route path={ROUTES.THREADS} element={<Threads />} />
        <Route path={ROUTES.MESSAGE} element={<Meessages />} />

        {/*  PROTECTED CTF */}
        {/*   <Route
            path={ROUTES.CHALLENGES}
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            }
          />
          */}

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      {/*<AuthProvider>
        <ToastProvider>*/}
      <AppContent />
      {/*</ToastProvider>
      </AuthProvider>*/}
    </Router>
  );
};

export default App;
