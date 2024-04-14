import Home from './pages/Home';
import useAuthContext from './hooks/useAuthContext';
import Authentication from './pages/Authentication';
import { ConvoContextProvider } from "./contexts/ConvoContext";
import { useState } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

function App() {
    const { token } = useAuthContext();
    const [method, setMethod] = useState('Login');
    return (
        <ConvoContextProvider>
            {token ? <Home /> : <Authentication method={method} setMethod={setMethod} />}
        </ConvoContextProvider>
    );
}

export default App;
library.add(fas);