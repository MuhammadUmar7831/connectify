export default function Info() {
  return (
    <div className="w-1/2 h-full flex flex-col items-start justify-start gap-2">
      <div className="flex justify-between items-center bg-black text-white rounded-2xl px-4 py-5 gap-2
      w-full flex-row">
        <div className="">
          <img src="../src/assets/react.svg" alt="b" width={50} height={70} className="rounded-2xl"/>
        </div>
        <div>
          Name
        </div>
        <div>
          Joined
        </div>
      </div>
      <div className="info bg-white mt-6 w-full rounded-2xl h-1/2">Info</div>
    </div>
  )
}
