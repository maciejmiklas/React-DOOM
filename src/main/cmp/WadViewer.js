import {connect} from "react-redux";
import {actionNavigationTitle, Navigation} from "./Navigation";
import React, {Component, createRef, useRef} from "react";
import {functions as wp} from "../wad/WadParser";
import {functions as bc} from "../wad/BitmapConverter";

import U from "../util";

class WadViewerTag extends Component {
	constructor(props) {
		super(props);
		const wadBytes = U.base64ToUint8Array(props.wad.content);
		const wadEither = wp.parseWad(wadBytes);
		const wad = wadEither.get();
		this.pic = wad.title.title;
		this.canvasRef = createRef()
		this.img = bc.toImageData(this.pic);
	}

	componentDidMount() {
		this.props.updateTitle();
		const ctx = this.canvasRef.current.getContext("2d");
		ctx.putImageData(this.img, 0, 0);
	}

	render() {
		return (
			<Navigation>
				"TITLEPIC from " {this.props.wadName}
				<canvas ref={this.canvasRef} width={this.pic.header.width} height={this.pic.header.height}></canvas>
			</Navigation>);
	}
}

const stateToProps = (state, wadName) => {
	const wads = {...state.wads};
	const wadNameStr = wadName.wadName;
	const wad = wads.files.find(w => w.name === wadNameStr);
	return {
		wad,
		wadName: wadNameStr
	};
};

const dispatchToProps = (dispatch, wadName) => {
	const wadNameStr = wadName.wadName;
	return {
		updateTitle: () => dispatch(actionNavigationTitle(wadNameStr)),
	};
};
export const WadViewer = connect(stateToProps, dispatchToProps)(WadViewerTag);