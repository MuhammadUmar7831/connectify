import { Routes, Route } from "react-router-dom";
import PersonalInfo from "../components/Info/Personal/PersonalInfo";
import GroupInfo from "../components/Info/Group/GroupInfo";
import MyInfo from "../components/Info/MyInfo/MyInfo";

export default function Info() {
  return (
    <Routes>
      <Route path="/personal/:id" element={<PersonalInfo />} />
      <Route path="/group/:id" element={<GroupInfo />} />
      <Route path="/my" element={<MyInfo />} />
    </Routes>
  )
}
