import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import ChatArea from "./pages/ChatArea";
import Info from "./pages/Info";
import Signin from "./pages/Signin";
import SuccessToaster from "./interface/toasters/SuccessToaster";
import ErrorToaster from "./interface/toasters/ErrorToaster";
import PrivateRoutes from "./components/PrivateRoutes";
import CreateGroup from "./pages/CreateGroup";
import Signup from "./pages/Signup";
import { useEffect } from "react";
import {gapi} from "gapi-script";

function App() {

  const clientId = "476553953625-r86dopv2fee9gtsnln507855orn3jko4.apps.googleusercontent.com";
  useEffect(() => { 
    function start(){
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    }

    gapi.load('client:auth2', start)
   })
  return (
    <div className="flex items-center justify-center p-4 w-screen h-screen bg-gray gap-2 overflow-x-auto">
      <BrowserRouter>
        <SuccessToaster />
        <ErrorToaster />
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Hero />} />
            <Route path="/chat/:chatId" element={<ChatArea />} />
            <Route path="/info/*" element={<Info />} />
            <Route path="/create/group" element={<CreateGroup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
