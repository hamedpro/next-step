import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
export const NewRoadMapLayerModal = ({
	visible,
	set_new_layer_modal_is_hidden,
}: {
	visible: boolean;
	set_new_layer_modal_is_hidden: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<Dialog
			style={{ width: "70vw", height: "50vh" }}
			footer={
				<Button>
					<i
						className="bi bi-send"
						style={{ marginRight: "4px" }}
					/>
					Submit
				</Button>
			}
			header="New Layer"
			visible={visible}
			onHide={() => set_new_layer_modal_is_hidden(true)}
		></Dialog>
	);
};
