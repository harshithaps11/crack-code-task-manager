import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Layout from './components/Layout';

function App() {
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;