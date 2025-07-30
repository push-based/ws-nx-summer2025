import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

// a changes
export function App() {
  return <RouterProvider router={router} />;
}

export default App;
