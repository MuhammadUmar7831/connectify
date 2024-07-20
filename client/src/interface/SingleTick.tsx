export default function SingleTick({ className, size }: { className?: string, size?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide lucide-check ${className}`}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
