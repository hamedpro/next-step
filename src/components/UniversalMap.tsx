import Graphviz from "graphviz-react";
import { ReactNode, useContext, useMemo, useState } from "react";
import { steps_to_dot } from "../helpers";
import { context } from "freeflow-react";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { roadmap_collection_thing, step_thing } from "../../types";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { SelectButton } from "primereact/selectbutton";
import { useWindowSize } from "@uidotdev/usehooks";
export const UniversalMap = ({ children }: { children: ReactNode }) => {
	var { cache, profiles_seed } = useContext(context);
	var active_profile_seed = find_active_profile_seed(profiles_seed);
	var active_user = cache.find((ci) => ci.thing_id === active_profile_seed?.user_id);

	var steps = cache.filter((ci) => ci.thing.type === "step") as cache_item<step_thing>[];

	var template = `
    # http://www.graphviz.org/content/cluster
  
    digraph {
      // Base Styling
      rankdir="TB";
      splines=true;
      overlap=false;
      nodesep="0.2";
      ranksep="0.4";
      label="Attack Tree for S3 Bucket with Video Recordings";
      labelloc="t";
      fontname="Lato";
      node [ shape="plaintext" style="filled, rounded" fontname="Lato" margin=0.2 ]
      edge [ fontname="Lato" color="#2B303A" ]
    
      // List of Nodes
    
      // base nodes
      reality [ label="Reality" fillcolor="#2B303A" fontcolor="#ffffff" ]
      attack_win [ label="Access video\nrecordings in\nS3 bucket\n(attackers win)" fillcolor="#DB2955" fontcolor="#ffffff" ]
    
        // attack nodes
        node [ color="#ED96AC" ]
      attack_1 [ label="API cache\n(e.g. Wayback\nMachine)" color="#C6CCD2" ]
      attack_2 [ label="AWS public\nbuckets search" ]
      attack_3 [ label="S3 bucket\nset to public" color="#C6CCD2" ]
      attack_4 [ label="Brute force" ]
      attack_5 [ label="Phishing" ]
      attack_6 [ label="Compromise\nuser credentials" ]
      attack_7 [ label="Subsystem with\naccess to\nbucket data" color="#C6CCD2" ]
      attack_8 [ label="Manually analyze\nweb client for access\ncontrol misconfig" ]
      attack_9 [ label="Compromise\nadmin creds" ]
      attack_10 [ label="Intercept 2FA" ]
      attack_11 [ label="SSH to an\naccessible\nmachine" ]
      attack_12 [ label="Lateral movement to\nmachine with access\nto target bucket" ]
      attack_13 [ label="Compromise\nAWS admin creds" ]
      attack_14 [ label="Compromise\npresigned URLs" ]
      attack_15 [ label="Compromise\nURL within N\ntime period" ]
      attack_16 [ label="Recon on S3 buckets" ]
      attack_17 [ label="Find systems with\nR/W access to\ntarget bucket" ]
      attack_18 [ label="Exploit known 3rd\nparty library vulns" ]
      attack_19 [ label="Manual discovery\nof 0day" ]
      attack_20 [ label="Buy 0day" ]
      attack_21 [ label="Exploit vulns" ]
      attack_22 [ label="0day in AWS\nmultitenant systems" ]
      attack_23 [ label="Supply chain\ncompromise\n(backdoor)" ]
    
      // defense nodes
      node [ color="#ABD2FA" ]
      defense_1 [ label="Disallow\ncrawling\non site maps" ]
      defense_2 [ label="Auth required / ACLs\n(private bucket)" ]
      defense_3 [ label="Lock down\nweb client with\ncreds / ACLs" ]
      defense_4 [ label="Perform all access\ncontrol server-side" ]
      defense_5 [ label="2FA" ]
      defense_6 [ label="IP allowlist for SSH" ]
      defense_7 [ label="Make URL\nshort lived" ]
      defense_8 [ label="Disallow the use\nof URLs to\naccess buckets" ]
      defense_9 [ label="No public system\nhas R/W access\n(internal only)" ]
      defense_10 [ label="3rd party library\nchecking / vuln\nscanning" ]
      defense_11 [ label="Exploit prevention\n/ detection" ]
      defense_12 [ label="Use single tenant\nAWS HSM" ]
    
      // List of Edges
    
      // branch 1 edges
      // this starts from the reality node and connects with the first "attack",
      // which is really just taking advantage of #yolosec (big oof)
      reality -> attack_1 [ xlabel="#yolosec" fontcolor="#DB2955" ]
      attack_1 -> attack_win	
    
      // branch 2 edges
      // this connects the reality node to the first mitigation, 
      // which helps avoid the #yolosec path from branch 1
      reality -> defense_1
      defense_1 -> attack_2
      attack_2 -> attack_3 [ xlabel="#yolosec" fontcolor="#DB2955" ]
      attack_3 -> attack_win
    
      // branch 3 edges
      // this connects the reality node to another mitigation,
      // which helps avoid the #yolosec path from branch 2
      reality -> defense_2
      defense_2 -> attack_4
      defense_2 -> attack_5
      attack_4 -> attack_6
      attack_5 -> attack_6
      attack_6 -> attack_7
      attack_7 -> attack_win
      // potential mitigation path
      attack_7 -> defense_3
      defense_3 -> attack_8
      attack_8 -> attack_win
      // potential mitigation path
      attack_8 -> defense_4 
      defense_4 -> attack_5 [ style="dashed" color="#7692FF" ]
      
      // branch 4 edges
      // this starts from the last mitigation loop vs. the reality node
      attack_5 -> attack_9
      attack_9 -> attack_11 [ xlabel="#yolosec" fontcolor="#DB2955" ]
      // potential mitigation path
      attack_9 -> defense_5 
      defense_5 -> attack_10 
      attack_10 -> attack_11
      // potential mitigation path
      attack_11 -> defense_6 
      defense_6 -> attack_12 
      attack_12 -> attack_win
    
      // branch 5 edges
      // this also represents a branch from the prior mitigation loop
      // but it is more difficult than branch 4, hence comes after
      // the new attack step allows attackers to skip some steps on branch 4
      // so it links back to branch 4, whose edges are already defined
      attack_5 -> attack_13
      attack_13 -> attack_11
      attack_13 -> defense_5
    
      // branch 6 edges
      // depending on the mitigations, the initial node allows for different outcomes
      // this also represents a branch from the prior mitigation loop
      // it is more difficult than branch 4 and branch 5, hence comes after
      attack_5 -> attack_14
      attack_14 -> attack_win
      attack_14 -> attack_15
      // potential mitigation path
      attack_14 -> defense_7 
      defense_7 -> attack_15 
      attack_15 -> attack_win
      // potential mitigation path
      attack_15 -> defense_8 
    
      // branch 7 edges
      // a new loop is born!
      // the first edges tie prior mitigations to the new attack step
      defense_2 -> attack_16
      defense_5 -> attack_16 [ style="dashed" color="#7692FF" ]
      defense_8 -> attack_16 [ style="dashed" color="#7692FF" ]
      attack_16 -> attack_17 [ xlabel="#yolosec" fontcolor="#DB2955" ]
      // potential mitigation path
      attack_17 -> defense_9 
      defense_9 -> attack_5 [ style="dashed" color="#7692FF" ]
      attack_17 -> attack_18
      // potential mitigation path
      attack_18 -> defense_10
    
      // branch 8 edges
      // we've reached the last path!
      // this is the most expensive one for attackers.
      // these attacks are definitely uncommon...
      // ...because attackers will be cheap / lazy if they can be.
      // these edges start from the last mitigation from branch 7
      defense_10 -> attack_19
      defense_10 -> attack_20
      attack_19 -> attack_21
      attack_20 -> attack_21
      attack_21 -> attack_win
      // potential mitigation path
      attack_21 -> defense_11 
      defense_11 -> attack_22 
      attack_22 -> attack_win 
      // potential mitigation path
      // for the purposes of illustration, this path represents a mitigation
      // that isn't actually implemented yet -- hence a dotted edge
      attack_22 -> defense_12 [ style="dotted" ]
      defense_12 -> attack_23 
      attack_23 -> attack_win
    
      // Subgraphs / Clusters
    
      // these clusters enforce the correct hierarchies
      subgraph initialstates {
          rank=same;
          attack_1;
          defense_1;
          defense_2;
        }
      subgraph authrequired {
          rank=same;
          attack_4;
          attack_5;
          attack_16;
        }
        subgraph phishcluster {
          rank=same;
          attack_6;
          attack_9;
          attack_13;
          attack_14;
          rankdir=LR;
        }
        // these invisible edges are to enforce the correct left-to-right order 
        // based on the level of attack difficulty
        attack_6 -> attack_9 -> attack_13 -> attack_14 [ style="invis" ]
    }`;
	var [view_mode, set_view_mode] = useState<"all" | "active_roadmap" | "active_collection">(
		"all"
	);
	var active_roadmap_id: undefined | number = active_user?.thing.value.active_roadmap;
	var active_roadmap_collection_id: undefined | number =
		active_user?.thing.value.active_roadmap_collection;

	var steps_to_show = steps;
	if (view_mode === "active_roadmap") {
		steps_to_show = steps.filter((step) => step.thing.value.roadmap_id === active_roadmap_id);
	} else if (view_mode === "active_collection") {
		var current_roadmap_collection = cache.find(
			(ci) => ci.thing_id === active_roadmap_collection_id
		) as cache_item<roadmap_collection_thing> | undefined;
		var roadmaps_of_this_collection =
			current_roadmap_collection?.thing.value.roadmaps.map((roadmap) => roadmap.id) || [];
		steps_to_show = steps.filter((step) =>
			roadmaps_of_this_collection.includes(step.thing.value.roadmap_id)
		);
	}

	var dot = useMemo(
		() => steps_to_dot(steps_to_show as cache_item<step_thing>[]),
		[JSON.stringify(steps_to_show)]
	);
	var { width, height } = useWindowSize();
	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				/* backgroundColor: "white", */
				position: "fixed",
			}}
			className="bg-neutral-900"
		>
			<div
				style={{
					position: "absolute",

					height: "calc(100vh)",
					width: "25vw",
					minWidth: "420px",
					borderTopRightRadius: "10px",
					borderBottomLeftRadius: "10px",
					overflowX: "hidden",

					overflowY: "auto",
				}}
				className="bg-neutral-700 shadow-lg"
			>
				{children}
			</div>
			<Graphviz
				dot={dot}
				className="w-full h-full"
				options={{
					useWorker: false,
					zoom: true,
					height: height || window.innerHeight,
					width: width || window.innerWidth,
				}}
			/>
			<div
				style={{
					position: "absolute",
					right: "8px",
					bottom: "8px",

					display: "flex",
					flexDirection: "column",
					rowGap: "8px",
					padding: "8px",
				}}
			>
				<SelectButton
					options={["all", "active_roadmap", "active_collection"]}
					value={view_mode}
					onChange={(e) => set_view_mode(e.value)}
				/>
			</div>
		</div>
	);
};
