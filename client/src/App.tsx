import { BrowserRouter, Routes, Route } from "react-router-dom"
import SideBar from "./components/SideBar"
import Main from "./pages/Main"
import Hero from "./pages/Hero"
import ChatArea from "./pages/ChatArea"
import Info from "./pages/Info"

function App() {

  return (
    <div className="flex items-center justify-center p-4 w-screen h-screen">
      <SideBar />
      <Main />
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Hero />} />
          <Route path={"/c/:chatId"} element={<ChatArea />} />
          <Route path={"/i/:id"} element={<Info />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
