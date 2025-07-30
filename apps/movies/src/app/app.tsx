import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
// comment here
// and another here

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
