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
            <div className="flex">
                <input type="text" onChange={(e) => { setQuery(e.target.value); }} placeholder="Enter username" className="text-input" />
                <button onClick={search} className="button-normal ml-2"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button>
            </div>
            <div className="h-full overflow-scroll my-2">
                {
                    result.length == 0 ?
                        <p>No Results</p> :
                        <>{result.map(el => <div key={el._id} className="border-b py-1 hover:bg-gray-300 cursor-pointer transition-all duration-100 ease-in-out" onClick={() => { onClick(el); }}>
                            {el.username}<br />
                        </div>)}</>
                }
            </div>
        </>
    );
}