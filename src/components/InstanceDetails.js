import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import * as Constants from '../constants/Constants';

class InstanceDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appId: this.props.appId,
			env: this.props.env,
			instanceInfo: []
		};
	}

	monitorLinkFormatter = (cell, row) => {
		return (
			<a href={row.monitorUrl} target="_blank" rel="noreferrer">
				{row.monitorUrl}
			</a>
		);
	};

	buildLinkFormatter = (cell, row) => {
		return (
			<a href={row.buildUrl} target="_blank" rel="noreferrer">
				{row.buildUrl}
			</a>
		);
	};

	versionFormatter = (cell, row) => {
		return (
			<a
				href={row.hostScheme + '://' + row.hostMap[this.props.env] + row.versionUri}
				target="_blank"
				rel="noreferrer"
			>
				{row.hostScheme + '://' + row.hostMap[this.props.env] + row.versionUri}
			</a>
		);
	};

	dependencyFormatter = (cell, row) => {
		return (
			<a
				href={row.hostScheme + '://' + row.hostMap[this.props.env] + row.dependencyVersionUri}
				target="_blank"
				rel="noreferrer"
			>
				{row.hostScheme + '://' + row.hostMap[this.props.env] + row.dependencyVersionUri}
			</a>
		);
	};

	fetchInstanceInfo() {
		fetch(Constants.INSTANCES_URL + '/' + this.state.appId + '?env=' + this.state.env, {
			method: 'GET',
			headers: {
				ApiKey: Constants.API_KEY,
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				if (res.ok && res.status === 200) {
					return res.json();
				}
			})
			.then((data) => {
				if (data != null && data !== '') this.setState({ instanceInfo: data });
			})
			.catch(console.log);
	}

	componentDidMount() {
		this.fetchInstanceInfo();
	}

	columns = [
		{
			text: 'Application',
			dataField: 'appId',
			hidden: true
		},
		{
			text: 'Instance',
			dataField: 'instance'
		},
		{
			text: 'Version',
			dataField: 'version'
		}
	];

	render() {
		return (
			<BootstrapTable
				condensed
				bordered={true}
				keyField="id"
				columns={this.columns}
				data={this.state.instanceInfo}
			/>
		);
	}
}

export default InstanceDetails;
