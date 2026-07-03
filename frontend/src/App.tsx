import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ROUTES } from "./utils/constants";
import { Signup } from "./pages/auth/Signup.tsx";
import { Login } from "./pages/auth/Login.tsx";
import Home from "./pages/Home";
import { Threads } from "./pages/threads/ThreadsPage.tsx";
import { Messages } from "./pages/messages/MessagesPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContactProvider } from "./context/ContactContext.tsx";
import { Contacts } from "./pages/contacts/ContactsPage.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

const AppContent: React.FC = () => {
  return (
    <main className='main-content flex'>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
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

        <Route path='*' element={<Navigate to={ROUTES.LOGIN} replace />} />
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
