import { BrowserRouter, Routes, Route } from "react-router-dom"
import SideBar from "./components/SideBar"
import Main from "./pages/Main"
import Hero from "./pages/Hero"
import ChatArea from "./pages/ChatArea"
import Info from "./pages/Info"
import Signin from "./pages/Signin"
import SuccessToaster from "./interface/toasters/SuccessToaster"
import ErrorToaster from "./interface/toasters/ErrorToaster"

function App() {

  return (
    <div className="flex items-center justify-center p-4 w-screen h-screen bg-gray gap-2 overflow-x-auto">
      <BrowserRouter>
        {/* <SideBar />
      <Main /> */}
        <SuccessToaster />
        <ErrorToaster />
        <Routes>
          <Route path={"/"} element={<Hero />} />
          <Route path={"/c/:chatId"} element={<ChatArea />} />
          <Route path={"/i/:id"} element={<Info />} />
          <Route path={"/signin"} element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
