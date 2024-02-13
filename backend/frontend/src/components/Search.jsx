import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";

export default function Search({ onClick }) {
    const { token } = useAuthContext();
    const [result, setResult] = useState([]);

    const search = async (query) => {
        const response = await fetch(`/user?search=${query}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await response.json();
        if (response.ok) {
            setResult(json);
        }
    };

    return (
        <>
            <input type="text" onChange={(e) => { search(e.target.value); }} placeholder="Enter username" className="text-input mb-2" />
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