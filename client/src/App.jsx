import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides" element={<PlantGuides />} />
            <Route path="/guides/:id" element={<PlantDetails />} />
            <Route path="/shop/plants" element={<PlantsShop />} />
            <Route path="/shop/flowers" element={<FlowersShop />} />
            <Route path="/shop/oils" element={<EssentialOils />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
