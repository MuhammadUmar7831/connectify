export default function Avatar({ image, isActive, className }: { image: string, isActive?: Boolean, className?: string }) {
    return (
        <div className={`relative h-12 w-14 ${className}`}>
            <img
                alt="user"
                src={image}
                className="h-full w-full object-cover rounded-full"
            />
            {isActive && <span className="w-3 h-3 rounded-full bg-green-600 absolute right-0 bottom-0 border-2 border-white"></span>}
        </div>
    )
}
