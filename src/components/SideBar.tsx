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
				icon={<i className="bi-box-arrow-in-right" />}
				text="Register or Login"
				url="/auth"
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
			<CustomLink
				icon={<i className="bi-collection-fill" />}
				text="Roadmap Collections"
				url="/roadmap_collections"
			/>
			<CustomLink
				icon={<i className="bi-collection" />}
				text="New Roadmap Collection"
				url="/roadmap_collections/new"
			/>
		</Sidebar>
	);
};
