

export default function Note({ title, text } : { title: string, text: string }) {
    return (
        <div className="bg-neutral-700 border p-2">
            <h3>{title}</h3>
            <p>{text}</p>
        </div>
    );
}