import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from "./pages/ChatPage";
import Homepage from "./pages/Homepage";
import { ToastContainer } from "react-toastify";

function App() {
  
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;