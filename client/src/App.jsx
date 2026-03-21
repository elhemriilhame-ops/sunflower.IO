import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantGuides from './pages/PlantGuides';
import PlantDetails from './pages/PlantDetails';
import PlantsShop from './pages/PlantsShop';
import FlowersShop from './pages/FlowersShop';
import EssentialOils from './pages/EssentialOils';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Components
import DashboardHome from './pages/admin/DashboardHome';
import UsersPage from './pages/admin/Users';
import NurseryRequests from './pages/admin/NurseryRequests';
import ProductsManagement from './pages/admin/Products';
import ArticlesManagement from './pages/admin/Articles';

// Layout wrapper for public pages to keep Navbar/Footer
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes with dedicated AdminLayout */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="pepiniere-requests" element={<NurseryRequests />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="articles" element={<ArticlesManagement />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* Special Route for Admin Login (no layout) */}
          <Route path="/admin-login" element={<Login isAdminPage={true} />} />

          {/* Public Routes with PublicLayout */}
          <Route path="/*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="guides" element={<PlantGuides />} />
                <Route path="guides/:id" element={<PlantDetails />} />
                <Route path="shop/plants" element={<PlantsShop />} />
                <Route path="shop/flowers" element={<FlowersShop />} />
                <Route path="shop/oils" element={<EssentialOils />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login isAdminPage={false} />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
