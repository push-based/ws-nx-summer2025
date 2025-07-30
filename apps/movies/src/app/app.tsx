import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

export function App() {
  // comment 
  return <RouterProvider router={router} />;
}

export default App;
