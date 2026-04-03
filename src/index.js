import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Signin from './auth/signin.jsx';
import Login from './auth/login.jsx';
import MainPage from './mainPage/mainPage.jsx';
import AdminArticles from './articles/adminArticles.jsx';
import DeclinedRequests from './articles/declinedRequests.jsx';
import './styles/global.css';
import AcceptedRequests from './articles/acceptedRequests.jsx';
import UserArticles from './articles/userArticles.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/signin' element={<Signin />}/>
      <Route path='/login' element={<Login />} />
      <Route path='/checkArticles' element={<AdminArticles />}/>
      <Route path='/declinedRequests' element={<DeclinedRequests />} />
      <Route path='/acceptedRequests' element={<AcceptedRequests />} />
      <Route path='/articles' element={<UserArticles />} />
    </Routes>
  </BrowserRouter>
);
