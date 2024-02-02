import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Search({ onClick }) {
    const { token } = useAuthContext();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);

    const search = async () => {
        setResult([]);
        const response = await fetch(`/user?search=${query}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await response.json();
        if (response.ok) {
            setResult(json);
        }
        // console.log(json);
    };

    return (
        <>
            <div className="flex mb-2">
                <input type="text" onChange={(e) => { setQuery(e.target.value); }} placeholder="Enter username" className="text-input mr-2" />
                <button onClick={search} className="button-icon px-2"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button>
            </div>
            <div className="h-full overflow-scroll no-scrollbar ">
                {
                    result.length == 0 ?
                        <p>No Results</p> :
                        <>{result.map(el => <div key={el._id} className="border-b border-border-primary py-1 hover:bg-bg-secondary cursor-pointer transition-all px-2" onClick={() => { onClick(el); }}>
                            {el.username}<br />
                        </div>)}</>
                }
            </div>
        </>
    );
}