import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUserCount } from '../../ReduxStore/actions/userAction';
import * as Constant from "./../../ReduxStore/constant";

class DefaultLink extends Component {
	constructor() {
		super();

		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		if (this.props.itemProps.hasSubMenu) {
			this.props.itemProps.toggleSubMenu(e)
		} else {

			this.props.itemProps.activateMe({
				newLocation: this.props.to,
				selectedMenuLabel: this.props.label,
			});
		}
	}

	render() {
		const { menuIcon, subMenuIcon, itemProps } = this.props
		if (itemProps.id === 'Directories' || itemProps.id === 'UiElements') {
			return (
				<span className="g_heading">
					{itemProps.label}
				</span>
			);
		} else {
			return (
				<span className={window.location.pathname === itemProps.to ? "active" : ""}>
					<NavLink to={`${itemProps?.to}`} onClick={(e) => { this.onClick(e); this.props.notSuccessed() }} className={window.location.pathname === itemProps.to ? menuIcon : subMenuIcon}>

						<img src={require(`../../images/sideBarIcon/${itemProps?.children[0]?.props?.className}`)} alt="" /> <b>{itemProps?.label}</b>
						{itemProps?.children[2] === false ? "" : <span className={itemProps?.children[2]?.props?.className}><i className="fa fa-chevron-down" /></span>}
					</NavLink>
				</span>
			);
		}
	}
};
const mapStateToProps = state => ({
	subMenuIcon: state.settings.isSubMenuIcon,
	menuIcon: state.settings.isMenuIcon
})

const mapDispatchToProps = dispatch => ({
	getAllUserCount: () => dispatch(getAllUserCount()),
	notSuccessed: () => dispatch({
		type: Constant.REMOVED_sUCCESSED,
		notSuccess: false,
	})
})
export default connect(mapStateToProps, mapDispatchToProps)(DefaultLink);