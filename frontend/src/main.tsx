import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <App />
    </AuthProvider>
);
