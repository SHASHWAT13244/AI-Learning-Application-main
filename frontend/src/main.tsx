import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <AuthProvider>
            <Toaster 
                position="top-right" 
                toastOptions={{ 
                    duration: 3000,
                    style: {
                        borderRadius: '16px',
                        padding: '12px 16px',
                    }
                }} 
            />
            <App />
        </AuthProvider>
    </ThemeProvider>
);
