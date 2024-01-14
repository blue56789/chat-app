import { useState } from "react";
import useAuthenticate from "../hooks/useAuthenticate";

function Authentication({ method, setMethod }) {
    const [pass, setPass] = useState('password');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const alt = method == 'Login' ? 'Signup' : 'Login';
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
        <div className="flex flex-col border border-black p-4 rounded-md shadow-lg w-72">
            <h1 className="text-3xl font-bold text-center mb-2">{method}</h1>

            <div className="mb-4">
                <p>Username:</p>
                <input
                    type="text"
                    onChange={(e) => { setUsername(e.target.value) }}
                    value={username}
                    className="text-input"
                />
            </div>

            <div className="mb-4">
                <p>Password:</p>
                <input
                    type={pass}
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                    className="text-input"
                />
                <button onClick={showPassword}
                    className="ml-[-40px]"
                >{pass == 'password' ? 'Show' : 'Hide'}</button>
            </div>

            <div className="mb-4">
                <button
                    className="button-normal"
                    onClick={submit} disabled={isLoading}>Submit</button>
            </div>

            <p>
                {method == 'Login' ? 'Don\'t have an account? ' : 'Already have an account? '}
                <a onClick={() => setMethod(alt)}
                    className="text-blue-600 underline hover:cursor-pointer active:text-blue-800">
                    {alt}
                </a>
            </p>

            {error && <div className="error mt-4">{error}</div>}
        </div>
    );
}
export default Authentication;