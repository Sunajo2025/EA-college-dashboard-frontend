/**
 * Main App Component
 * Renders the application routes with theme provider
 */

import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
