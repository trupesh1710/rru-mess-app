import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserView from './UserView';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserView />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
