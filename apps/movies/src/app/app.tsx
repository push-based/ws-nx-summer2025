import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

export function App() {
  console.log('App');
  return <RouterProvider router={router} />;
}

export default App;
