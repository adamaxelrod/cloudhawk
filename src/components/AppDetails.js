import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

class AppDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appId: this.props.appId,
			appInfo: []
		};
	}

	monitorLinkFormatter = (cell, row) => {
		return <a href={row.monitorUrl}>{row.monitorUrl}</a>;
	};

	buildLinkFormatter = (cell, row) => {
		return <a href={row.buildUrl}>{row.buildUrl}</a>;
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
			text: 'Dependencies',
			dataField: 'dependencyVersionUri'
		},
		{
			text: 'Category',
			dataField: 'category'
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

export default AppDetails;
