import { useState } from "react";
import useAuthenticate from "../hooks/useAuthenticate";

function Authentication({ method, setMethod }) {
    const [pass, setPass] = useState('password');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { isLoading, error, authenticate } = useAuthenticate();

    const showPassword = () => {
        setPass(pass === 'password' ? 'text' : 'password');
    };
    const submit = async () => {
        await authenticate(username, password, method.toLowerCase());
        // if (!error) {
        //     setPassword('');
        //     setUsername('');
        // }
    };
    return (
        <div className="card" style={{ maxWidth: 280 + 'px' }}>
            <h1>{method}</h1> <br />

            <div>
                <label htmlFor="username">Username:</label><br />
                <input
                    type="text" id="username"
                    onChange={(e) => { setUsername(e.target.value) }}
                    value={username}
                />
            </div> <br />

            <div>
                <label htmlFor="password">Password:</label><br />
                <input
                    type={pass} id="password"
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                />
                <button className="" id="show" onClick={showPassword}>{pass == 'password' ? 'Show' : 'Hide'}</button>
            </div> <br />

            <div>
                {isLoading ?
                    <div className="loader"></div> :
                    <button className="" onClick={submit} disabled={isLoading}>Submit</button>
                }
            </div> <br />

            {method === 'Login' ?
                <p>Don&#39;t have an account? <a onClick={() => setMethod('Signup')}>Signup</a></p> :
                <p>Already have an account? <a onClick={() => setMethod('Login')}>Login</a></p>
            }

            {error && <><br /><div className="error">{error}</div></>}
        </div>
    );
}
export default Authentication;