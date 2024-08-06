import Search from './Search'
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Link } from 'react-router-dom';

export default function MainHeader() {
  return (
    <div className='flex justify-between items-center bg-white rounded-2xl px-4 py-5 gap-2'>
      <span className='font-semibold text-2xl'>Chat</span>
      <Search />
      <Link to="/create/group" className='bg-orange rounded-full w-[56px] h-[40px] flex items-center justify-center cursor-pointer hover:bg-orange-100'><AiOutlineUsergroupAdd className='text-white text-2xl' /></Link>
    </div>
  )
}
