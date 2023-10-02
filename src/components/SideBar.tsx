import { Sidebar } from "primereact/sidebar";
import { CustomLink } from "./CustomLink";
export const SideBar = ({ visible, onHide }: { visible: boolean; onHide: () => void }) => {
	return (
		<Sidebar
			visible={visible}
			onHide={onHide}
			position="left"
		>
			<h2 style={{ marginTop: "0px" }}>welcome to Next Step!</h2>
			<CustomLink
				icon={<i className="bi-person-plus" />}
				text="Register a new account"
				url="/register"
			/>
			<CustomLink
				icon={<i className="bi-box-arrow-in-right" />}
				text="Login into your account"
				url="/login"
			/>

			<CustomLink
				icon={<i className="bi-signpost-2" />}
				text="Roadmaps"
				url="/roadmaps"
			/>
			<CustomLink
				icon={<i className="bi-sign-turn-slight-right" />}
				text="New Roadmap"
				url="/roadmaps/new"
			/>
		</Sidebar>
	);
};
