import { useEffect, useState } from "react";
import useAuthenticate from "../hooks/useAuthenticate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Authentication({ method, setMethod }) {
    const [pass, setPass] = useState('password');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const alt = method == 'Login' ? 'Signup' : 'Login';
    const { isLoading, error, setError, authenticate } = useAuthenticate();

    const showPassword = () => {
        setPass(pass === 'password' ? 'text' : 'password');
    };
    const submit = async (e) => {
        e.preventDefault();
        if (method == 'Signup' && password !== rePassword)
            setError('Passwords don\'t match');
        else
            await authenticate(username.trim(), password.trim(), method.toLowerCase());
    };

    useEffect(() => { setError(null) }, [setError, password, username, method]);

    return (
        <form
            className="flex flex-col border bg-bg-primary backdrop-blur-[2px] border-border-primary p-4 rounded-lg w-72 transition-all"
            onSubmit={submit}
        >
            <h1 className="title text-center mb-4">{method}</h1>

            <label className="mb-4">
                Username:
                <input
                    type="text"
                    onChange={(e) => { setUsername(e.target.value.toLowerCase()) }}
                    value={username}
                    className="text-input"
                    autoFocus
                    required
                />
            </label>

            <label className="mb-4">
                Password:
                <input
                    type={pass}
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                    className="text-input"
                    required
                />
                <span onClick={showPassword}
                    className="ml-[-25px]"
                >
                    <FontAwesomeIcon icon="fa-solid fa-eye" className={`${pass == 'password' ? 'text-gray-500' : 'text-blue-500'} hover:cursor-pointer`} />
                </span>
            </label>

            {
                method == 'Signup' &&
                <label className="mb-4">
                    Confirm Password:
                    <input
                        type="password"
                        onChange={(e) => { setRePassword(e.target.value) }}
                        value={rePassword}
                        className="text-input"
                        required
                    />
                </label>
            }

            <div className="flex justify-center my-4">
                {isLoading ?
                    <div className="loader"></div> :
                    <input
                        type="submit"
                        value="Submit"
                        className="button-normal w-full"
                        disabled={isLoading} />
                }
            </div>

            <div className="text-center">
                {method == 'Login' ? 'Don\'t have an account? ' : 'Already have an account? '}
                <a onClick={() => setMethod(alt)}
                    className="text-blue-500 underline hover:cursor-pointer active:text-blue-800">
                    {alt}
                </a>
            </div>

            {error && <div className="error mt-4">{error}</div>}
        </form>
    );
}
export default Authentication;