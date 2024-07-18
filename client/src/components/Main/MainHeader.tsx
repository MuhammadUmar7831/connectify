import Search from './Search'
import { IoIosAdd } from "react-icons/io";

export default function MainHeader() {
  return (
    <div className='flex justify-between items-center bg-white rounded-2xl px-4 py-5 gap-2'>
      <span className='font-semibold text-2xl'>Chat</span>
      <Search />
      <div className='bg-orange rounded-full w-[56px] h-[40px] flex items-center justify-center cursor-pointer hover:bg-orange-100'><IoIosAdd className='text-white text-3xl' /></div>
    </div>
  )
}
