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
import { Messages } from './pages/Messages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Contacts } from './pages/Contact';

const AppContent: React.FC = () => {

  return (
    <main className="main-content flex">
      <Routes>
        <Route path={ROUTES.HOME} element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Signup />} />
        <Route path={ROUTES.THREADS} element={
          <ProtectedRoute>
            <Threads/>
          </ProtectedRoute>
        } />
        <Route path={`${ROUTES.MESSAGE}/:id`} element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
          <Route path={ROUTES.CONTACTS} element={
          <ProtectedRoute>
            <Contacts/>
          </ProtectedRoute>
        } />


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
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/*<AuthProvider>
        <ToastProvider>*/}
        <AppContent />
        {/*</ToastProvider>
      </AuthProvider>*/}
      </Router>
    </QueryClientProvider  >
  );
};

export default App;
