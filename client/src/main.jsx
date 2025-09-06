import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './authContext.jsx';
import ProjectRoutes from '../routes.jsx';
import { BrowserRouter } from 'react-router-dom'; // ✅ Correct import
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter> {/* ✅ Correct usage */}
        <ProjectRoutes />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);