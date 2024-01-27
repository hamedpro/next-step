import { useContext } from "react";
import { CustomLink } from "./CustomLink";
import { UserFeed } from "./UserFeed";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
export const Root = () => {
	var { parsed_virtual_localstorage } = useContext(ServerSyncContext);
	if (parsed_virtual_localstorage.active_username) {
		return <UserFeed />;
	} else {
		return (
			<div style={{ padding: "8px" }}>
				<h1>
					Welcome to{" "}
					<span
						style={{
							color: "blue",
							background: "white",
							borderRadius: "4px",
							padding: "0px 8px",
						}}
					>
						Next Step!
					</span>
				</h1>

				<div style={{ padding: "4px" }}>
					<h3>Quick Access: </h3>
					{[
						{
							url: "/roadmaps",
							title: "RoadMaps :",
							text: "Take a look at RoadMaps if you will",
						},
						{
							url: "/roadmaps/new",
							title: "New RoadMap :",
							text: "publish a new RoadMap",
						},
					].map((item) => (
						<CustomLink
							key={JSON.stringify(item)}
							style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
							url={item.url}
							text={`${item.title} ${item.text}`}
							icon={<i className="bi bi-link-45deg" />}
						/>
					))}
					<br />
					<h3>Contact Us:</h3>
					<p style={{ maxWidth: "500px", margin: "20px 0px" }}>
						This project is under heavy development. feel free to contact us if you have
						any suggestion or believe something has gone wrong.
					</p>
					<p style={{ maxWidth: "500px", margin: "20px 0px" }}>
						Also we're looking for <mark>Developers</mark> and{" "}
						<mark>Product Managers</mark>. take a look at our GitHub repository and join
						our journey!
					</p>

					<CustomLink
						text={"hamedpro30@gmail.com"}
						icon={<i className="bi bi-envelope flex items-center" />}
					/>
					<CustomLink
						text={"hamedpro/next-step"}
						icon={<i className="bi bi-github flex items-center" />}
						url="https://github.com/hamedpro/next-step"
					/>
				</div>
			</div>
		);
	}
};
