import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider} from './contexts/UserContext';
import Bo from "./pages/bo"
import Fo from "./pages/fo"

function AppRoutes() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Fo />} />
        <Route path="/web/*" element={<Fo />} />

        <Route path="/admin/*" element={<Bo />} />
      </Routes>
    </Router>
  )
}
function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}




export default App
