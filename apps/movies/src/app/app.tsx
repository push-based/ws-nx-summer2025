import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

export function App() {
  console.log('App component is rendering again.....');
  console.log('App component is rendering again.....');
  return <RouterProvider router={router} />;
}

export default App;
