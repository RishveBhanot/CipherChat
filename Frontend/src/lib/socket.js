import {io} from "socket.io-client";

let socket = null;

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:9001" : "/";

export const connectSocket = (userId) => {
    if(!userId || (socket && socket.connected)) return;
    
    socket = io(BASE_URL, {
        query: {userId},
    })

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if(socket && socket.connected) socket.disconnect();
};