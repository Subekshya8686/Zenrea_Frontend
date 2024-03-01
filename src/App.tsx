import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import AppHeader from "./components/app-header/AppHeader.tsx";
import HomePage from "./pages/Home.tsx";
import LoginRegister from "./pages/LoginRegister.tsx";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/",
    element: <LoginRegister />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppHeader />
        <Box sx={{ mt: 10 }}>
          <RouterProvider router={router} />
        </Box>
      </QueryClientProvider>
    </>
  );
}
export default App;
