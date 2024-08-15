export default function Avatar({ image, isActive, className }: { image: string, isActive?: Boolean, className?: string }) {
    return (
        <div className={`relative rounded-full w-20 lg:w-14 aspect-square ${className}`}>
            <div className="h-full w-full rounded-full overflow-hidden aspect-square">
                <img
                    alt="user"
                    src={image}
                    className="h-full w-full object-cover"
                />
            </div>
            {isActive && <span className="w-2 h-2 rounded-full bg-green-600 absolute right-0 bottom-1 border-white border"></span>}
        </div>
    )
}
