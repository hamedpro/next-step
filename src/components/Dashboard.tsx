import { Nodes } from "./Nodes";
import { CharacterStatus } from "./CharacterStatus";
import { UniversalMap } from "./UniversalMap";

export const Dashboard = () => {
	return (
		<>
			<div
				style={{
					padding: "12px",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div style={{ width: "90%" }}>
					{[
						["UniversalMap", <UniversalMap />],
						["Now", <CharacterStatus />],
						["Nodes", <Nodes />],
					].map(([title, element]) => (
						<>
							<h1>{title}</h1>
							<div
								style={{
									border: "1px solid white",
									borderRadius: "10px",
									padding: "20px",
									marginBottom: "40px",
								}}
							>
								{element}
							</div>
						</>
					))}
				</div>
			</div>
		</>
	);
};
