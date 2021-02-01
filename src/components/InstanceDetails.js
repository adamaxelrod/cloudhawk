import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

class InstanceDetails extends Component {
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

	fetchAppInfo(appId) {
		fetch('/applications/' + this.state.appId, {
			method: 'GET',
			headers: {
				ApiKey: 'pjZ4pSRtCkU1WiPCRIb92jzkJSqKBJ35RJVMiUS6',
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
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
			dataField: 'id'
		},
		{
			text: 'Category',
			dataField: 'category'
		},
		{
			text: 'URL',
			dataField: 'hostMap',
			hidden: true
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
			<BootstrapTable condensed bordered={true} keyField="id" columns={this.columns} data={this.state.appInfo} />
		);
	}
}

export default InstanceDetails;
