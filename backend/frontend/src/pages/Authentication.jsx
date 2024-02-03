import { useEffect, useState } from "react";
import useAuthenticate from "../hooks/useAuthenticate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Authentication({ method, setMethod }) {
    const [pass, setPass] = useState('password');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const alt = method == 'Login' ? 'Signup' : 'Login';
    const { isLoading, error, setError, authenticate } = useAuthenticate();

    const showPassword = () => {
        setPass(pass === 'password' ? 'text' : 'password');
    };
    const submit = async () => {
        await authenticate(username, password, method.toLowerCase());
    };

    useEffect(() => { setError(null) }, [setError, password, username, method]);

    return (
        <div className="flex flex-col border border-border-primary p-4 rounded-lg w-72 gap-4 transition-all">
            <h1 className="title text-center">{method}</h1>

            <div className="">
                <p>Username:</p>
                <input
                    type="text"
                    onChange={(e) => { setUsername(e.target.value) }}
                    value={username}
                    className="text-input"
                />
            </div>

            <div className="">
                <p>Password:</p>
                <input
                    type={pass}
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                    className="text-input"
                />
                <button onClick={showPassword}
                    className="ml-[-25px]"
                >
                    <FontAwesomeIcon icon="fa-solid fa-eye" className={pass == 'password' ? 'text-gray-500' : 'text-blue-500'} />
                </button>
            </div>

            <div className="flex justify-center">
                <button
                    className="button-normal w-full"
                    onClick={submit} disabled={isLoading}>Submit</button>
            </div>

            <div className="text-center">
                {method == 'Login' ? 'Don\'t have an account? ' : 'Already have an account? '}
                <a onClick={() => setMethod(alt)}
                    className="text-blue-600 underline hover:cursor-pointer active:text-blue-800">
                    {alt}
                </a>
            </div>

            {error && <div className="error">{error}</div>}
        </div>
    );
}
export default Authentication;