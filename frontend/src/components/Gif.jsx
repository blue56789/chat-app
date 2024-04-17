import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Gif({ onClick }) {
    const { token } = useAuthContext();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);
    const search = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/gif?search=${query}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await response.json();
        if (response.ok)
            setResult(json);
    };
    return (
        <div className="transition-all flex flex-col gap-2 p-2 w-64 h-96 border border-border-primary rounded-lg bg-bg-tertiary">
            <form className="flex">
                <input type="text" className="bg-bg-secondary rounded-lg w-full px-1 outline-none" placeholder="Search Tenor" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button onClick={search} type="submit" className="-ml-6 hover:bg-black px-1 rounded-lg">
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                </button>
            </form>
            <div className="flex flex-wrap w-full h-full content-start overflow-y-scroll">
                {result.length == 0 && <p>No results</p>}
                {result.map((g) => {
                    return <img key={g.id} src={g.media_formats.nanogif.url} onClick={() => onClick(g)} className="max-w-32 border border-border-primary rounded-lg m-2 hover:cursor-pointer" />;
                })}
            </div>
        </div>
    );
}