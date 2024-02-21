import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./main.css";
import { useCollection } from "./useCollection";
import { node } from "../types";
function Test() {
	return "its working";
}
var mode: "test" | "real" = "test";
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
