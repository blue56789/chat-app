import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";

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
        <div id="search">
            <div className="searchbar">
                <input type="text" onChange={(e) => { setQuery(e.target.value); }} placeholder="Enter username" />
                <button onClick={search}>Search</button>
            </div>
            <div className="convos">
                {
                    result.length == 0 ?
                        <p style={{ padding: 10 + 'px' }}>No Results</p> :
                        <>{result.map(el => <div key={el._id} className="convo" onClick={() => { onClick(el); }}>
                            {el.username}<br />
                        </div>)}</>
                }
            </div>
        </div>
    );
}