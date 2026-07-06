import CiaRoutes from './routes/CiaRoutes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const theme = storedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return <CiaRoutes />;
}

export default App
