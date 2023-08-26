import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		VITE_API_ENDPOINT: "http://127.0.0.1:3400",
	},
});
