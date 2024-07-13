import { GrConnect } from "react-icons/gr";

export default function Hero() {
  return (
    <div className="w-2/3 min-w-[820px] h-full bg-white rounded-2xl flex flex-col justify-center items-center">
        <GrConnect className="size-20 text-orange"/>
        <p className="text-black font-semibold text-2xl my-3">Welcome to Connectify</p>
        <p className="text-black w-2/3 text-center">Connectify is your go-to platform for real-time, meaningful connections. Whether you're catching up with friends, meeting new people, or collaborating with colleagues, Connectify brings you closer to the moments that matter.</p>
    </div>
  )
}
