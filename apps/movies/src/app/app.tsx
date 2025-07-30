import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { useDoesntExist } from 'react';

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
