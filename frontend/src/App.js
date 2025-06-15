import AddExpense from './components/AddExpense';
import ChangePassword from './components/ChangePassword';
import Dashboard from './components/Dashboard';
import ExpenseReport from './components/ExpenseReport';
import Home from './components/Home';
import Login from './components/Login';
import ManageExpense from './components/ManageExpense';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/add-expense" element={<AddExpense/>}></Route>
          <Route path="/manage-expense" element={<ManageExpense/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/expense-report" element={<ExpenseReport/>}></Route>
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
