import { io } from "socket.io-client";
let socket;
export const connectSocket = ({
    userId,
    companyId,
    employeeNumber,
    token
}) => {

    socket = io("https://dashboard.mtldispatch.com", {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        withCredentials: true,
        query: {
            employeeNumber: String(employeeNumber || ""),
            companyId: String(companyId || ""),
            userId: String(userId || ""),
        },
        auth: {
            token: token || "",
            userId: String(userId || ""),
            companyId: String(companyId || ""),
            employeeNumber: String(employeeNumber || ""),
        },
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
        console.log("Socket connect_error:", err.message, err);
    });

    return socket;
};
export const getSocket = () => socket;
