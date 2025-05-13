import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Pages
import HomeScreen from './pages/home/Screen';
import ObjectRecognitionScreen from './pages/objectRecognition/Screen';

function App() {
  return (
    <Router>
      <Routes>
        <Route index path='/' element={<HomeScreen />} />
        <Route path='/home' element={<div className='p-4 min-h-svh'><ObjectRecognitionScreen /></div>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  )
}

export default App;