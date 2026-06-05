import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import BusinessList from './pages/BusinessList';
import BusinessProfile from './pages/BusinessProfile';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddBusiness from './pages/AddBusiness';
import MyBusiness from './pages/MyBusiness';
import EditBusiness from './pages/EditBusiness';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/business-list" element={<BusinessList />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/edit-business/:id" element={<EditBusiness />} />
            <Route path="/business/:id/edit" element={<EditBusiness />} />
            <Route path="/business/:id" element={<BusinessProfile />} />
            <Route path="/my-business" element={<MyBusiness />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
