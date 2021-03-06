import React, { Component } from 'react';
import { GoFileMedia } from 'react-icons/go';
import img from '../../../../img/notfound.png';

export default class ImageAdd extends Component {
	// Start the popover closed
	state = {
		url: '',
		open: false
	};

	// When the popover is open and users click anywhere on the page,
	// the popover should close
	componentDidMount() {
		document.addEventListener('click', this.closePopover);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.closePopover);
	}

	// Note: make sure whenever a click happens within the popover it is not closed
	onPopoverClick = () => {
		this.preventNextClose = true;
	};

	openPopover = () => {
		if (!this.state.open) {
			this.preventNextClose = true;
			this.setState({
				open: true
			});
		}
	};

	closePopover = () => {
		if (!this.preventNextClose && this.state.open) {
			this.setState({
				open: false
			});
		}

		this.preventNextClose = false;
	};

	addImage = () => {
		let image = img;
		const imageFiles = ['jpeg', 'jpg', 'gif', 'png'];

		if (imageFiles.some(el => this.state.url.includes(el))) {
			image = this.state.url;
		}
		const { editorState, onChange } = this.props;
		onChange(this.props.modifier(editorState, image));
	};

	changeUrl = evt => {
		this.setState({ url: evt.target.value });
	};

	render() {
		const popoverClassName = this.state.open
			? 'RichEditor__addImage-addImagePopover'
			: 'RichEditor__addImage-addImageClosedPopover';
		const buttonClassName = this.state.open
			? 'RichEditor-styleButton RichEditor-activeButton'
			: 'RichEditor-styleButton';

		return (
			<div className="RichEditor__addImage">
				<GoFileMedia
					style={{ fontSize: '2rem' }}
					className={buttonClassName}
					onMouseUp={this.openPopover}
				/>
				<div className={popoverClassName} onClick={this.onPopoverClick}>
					<input
						type="text"
						placeholder="Paste the image url …"
						className="RichEditor__addImage-addImageInput"
						onChange={this.changeUrl}
						value={this.state.url}
					/>
					<button
						className="RichEditor__addImage-addImageConfirmButton"
						type="button"
						onClick={this.addImage}>
						Add
					</button>
				</div>
			</div>
		);
	}
}
