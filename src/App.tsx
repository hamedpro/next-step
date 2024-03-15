import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { UniversalMap } from "./components/UniversalMap";
import { Root } from "./components/Root";
import { Node } from "./components/Node";
import { Goal } from "./components/Goal";
import { GoalChoosing } from "./components/GoalChoosing";
import { GoalTimingSettings } from "./components/GoalTimingSettings";
import { Calendar } from "./components/Calendar";
import { PhoneNumberInputPage } from "./components/PhoneNumberInputPage";
import VerificationCodeInput from "./components/VerificationCodeInput";
import { VerificationCodeInputPage } from "./components/VerificationCodeInputPage";

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/dashboard"
					element={<Dashboard />}
				/>
				<Route
					path="/universal_map"
					element={<UniversalMap />}
				/>
				<Route
					element={<Root />}
					path="/"
				/>
				<Route
					path="/nodes/:node_id"
					element={<Node />}
				/>
				<Route
					path="/auth/phone_number_input"
					element={<PhoneNumberInputPage />}
				/>
				<Route
					path="/auth/verification_code_input"
					element={<VerificationCodeInputPage />}
				/>

				<Route
					path="/goal"
					element={<Goal />}
				/>
				<Route
					path="/goal/choosing"
					element={<GoalChoosing />}
				/>
				<Route
					path="/goal/timing"
					element={<GoalTimingSettings />}
				/>
				<Route
					path="/calendar"
					element={<Calendar />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
