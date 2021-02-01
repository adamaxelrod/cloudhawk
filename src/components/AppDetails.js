import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import InstanceDetails from './InstanceDetails';
import * as Constants from '../constants/Constants';

class AppDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appId: this.props.appId,
			env: this.props.env,
			appInfo: []
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

	hostFormatter = (cell, row) => {
		return row.hostMap[this.props.env];
	};

	versionFormatter = (cell, row) => {
		return (
			<a
				href={row.hostScheme + '://' + row.hostMap[this.props.env] + row.versionUri}
				target="_blank"
				rel="noreferrer"
			>
				{row.versionUri}
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
				{row.dependencyVersionUri}
			</a>
		);
	};

	fetchAppInfo(appId) {
		fetch(Constants.APPLICATIONS_URL + '/' + this.state.appId, {
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
				if (data != null && data !== '') this.setState({ appInfo: data });
			})
			.catch(console.log);
	}

	componentDidMount() {
		this.fetchAppInfo(this.state.appId);
	}

	columns = [
		{
			text: 'Application',
			dataField: 'id',
			hidden: true
		},
		{
			text: 'Category',
			dataField: 'category',
			hidden: true
		},
		{
			text: 'URL',
			dataField: 'hostMap',
			formatter: this.hostFormatter
		},
		{
			text: 'Scheme',
			dataField: 'hostScheme',
			hidden: true
		},
		{
			text: 'Port',
			dataField: 'hostPort',
			hidden: true
		},
		{
			text: 'Version',
			dataField: 'verionUri',
			formatter: this.versionFormatter
		},
		{
			text: 'Dependencies',
			dataField: 'dependencyVersionUri',
			formatter: this.dependencyFormatter
		},
		{
			text: 'Monitor',
			dataField: 'monitorUrl',
			formatter: this.monitorLinkFormatter
		},
		{
			text: 'Build',
			dataField: 'buildUrl',
			formatter: this.buildLinkFormatter
		}
	];

	render() {
		return (
			<div>
				<BootstrapTable
					condensed
					bordered={true}
					keyField="id"
					columns={this.columns}
					data={this.state.appInfo}
				/>
				<InstanceDetails env={this.state.env} appId={this.state.appId} />
			</div>
		);
	}
}

export default AppDetails;
