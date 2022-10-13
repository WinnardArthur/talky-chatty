import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from "./pages/ChatPage";
import Homepage from "./pages/Homepage";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;