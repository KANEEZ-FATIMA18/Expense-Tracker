import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid #27272a',
            fontSize: '13px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#000',
            },
          },
        }}
      />
      {user ? <Dashboard /> : <AuthForm />}
    </>
  );
}

export default App;
