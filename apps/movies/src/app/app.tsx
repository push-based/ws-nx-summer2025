import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

export function App() {
  // hey this is a comment
  return <RouterProvider router={router} />;
}

export default App;
