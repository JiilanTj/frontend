// App.js
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import WheelPage from './pages/WheelPage';
import WinnersPage from './pages/WinnersPage';
import WheelDetailsPage from './pages/WheelDetailsPage';
import EditWheelPage from './pages/EditWheelPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Routes>
          {/* Public Route */}
          <Route path="/wheel/:id" element={<WheelPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/wheel/:wheelId/winners" element={
            <ProtectedRoute>
              <WinnersPage />
            </ProtectedRoute>
          } />
          
          <Route path="/wheel/:wheelId/details" element={
            <ProtectedRoute>
              <WheelDetailsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/wheel/:id/edit" element={
            <ProtectedRoute>
              <EditWheelPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;