import { useSelector } from 'react-redux';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {user ? <Dashboard /> : <AuthForm />}
    </>
  );
}

export default App;
