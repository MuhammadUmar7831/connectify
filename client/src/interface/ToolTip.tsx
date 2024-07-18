
export default function ToolTip({ tip }: { tip: string }) {
    return (
        <>
            <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm bg-orange text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-14 opacity-0 m-4 mx-auto text-nowrap p-1 pointer-events-none">{tip}</span>
        </>
    )
}
