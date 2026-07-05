import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ContactProvider } from './context/ContactContext.tsx';
import { Login } from './pages/auth/Login.tsx';
import { Signup } from './pages/auth/Signup.tsx';
import { Contacts } from './pages/contacts/ContactsPage.tsx';
import { Messages } from './pages/messages/MessagesPage.tsx';
import { Threads } from './pages/threads/ThreadsPage.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { ROUTES } from './utils/constants';

const AppContent: React.FC = () => {
  return (
    <main className="main-content flex">
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Signup />} />
        <Route
          path={ROUTES.THREADS}
          element={
            <ProtectedRoute>
              <Threads />
            </ProtectedRoute>
          }
        />
        <Route
          path={`${ROUTES.MESSAGE}/:id`}
          element={
            <ProtectedRoute>
              <ContactProvider>
                <Messages />
              </ContactProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONTACTS}
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${ROUTES.MESSAGE}`}
          element={
            <ProtectedRoute>
              <ContactProvider>
                <Messages />
              </ContactProvider>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </main>
  );
};

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/*<AuthProvider>
        <ToastProvider>*/}
        <AppContent />
        {/*</ToastProvider>
      </AuthProvider>*/}
      </Router>
    </QueryClientProvider>
  );
};

export default App;
