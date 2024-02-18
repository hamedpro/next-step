import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./main.css";
function Test() {
	return "its working";
}
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
