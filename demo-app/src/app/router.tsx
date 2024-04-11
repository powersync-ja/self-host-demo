import { createBrowserRouter } from 'react-router-dom';
import CustomerListsPage from './views/customer-lists/page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerListsPage />
  }
]);
