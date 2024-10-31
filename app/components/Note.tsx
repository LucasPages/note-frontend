

export default function Note({ title, text } : { title: string, text: string }) {
    return (
        <div className="bg-neutral-700 px-3 py-2 rounded-md flex flex-col gap-2 h-40 overflow-scroll">
            <h3 className="shrink pb-2 text-xl">{title}</h3>
            <p className="h-2/3 shrink-0 text-sm">{text}</p>
        </div>
    );
}