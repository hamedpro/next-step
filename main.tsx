import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./main.css";
import { ServerSyncContextProvider } from "react_stream/dist/ServerSyncContextProvider";
ReactDOM.createRoot(document.getElementById("root")!).render(
	<ServerSyncContextProvider server_endpoint={import.meta.env.VITE_SERVER_ENDPOINT}>
		<App />
	</ServerSyncContextProvider>
);
