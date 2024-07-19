export default function Message({ me, content }: { me: Boolean, content: String }) {
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
      <div className={`${me ? 'bg-orange rounded-l-2xl text-white' : 'bg-gray-100 rounded-r-2xl text-black'} rounded-t-2xl p-4 text-sm`}>
        <p>{content}</p>
      </div>
    </div>
  )
}
