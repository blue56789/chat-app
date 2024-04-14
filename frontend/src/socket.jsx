import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.DEV ? 'http://localhost:5000' : undefined;
const socket = io(ENDPOINT);

export default socket;