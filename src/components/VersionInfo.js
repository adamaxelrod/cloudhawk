import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import AppDetails from './AppDetails';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class VersionInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			env: this.props.env,
			versionInfo: []
		};
	}

	rowBgFormat = (cell, row) => {
		return { backgroundColor: '#1F456E', color: 'white', fontWeight: 'bold', width: '9' };
	};

	rowSelectFormat = (cell, row) => {
		return { backgroundColor: 'green' };
	};

	rowBgHighlightFormat = (cell, row) => {
		//Check if last deploy was within 30 mins and highlight accordingly
		if (this.getTimeDelta(row.lastDeployTime) < 1800) {
			return { backgroundColor: '#33FF33', color: 'black', fontWeight: 'bold', width: '9' };
		} else {
			return { backgroundColor: '#1F456E', color: 'white', fontWeight: 'bold', width: '9' };
		}
	};

	deployDateFormatter = (cell, row) => {
		return this.getTimeDelta(row.lastDeployTime) + ' secs ago';
	};

	statusDateFormatter = (cell, row) => {
		var d = new Date(parseInt(row.lastStatusPollTime, 10));
		var ds = d.toString('MM/dd/yy HH:mm');
		return ds;
	};

	getTimeDelta(timeVal) {
		let curr = Date.now();
		let inputTime = new Date(parseInt(timeVal, 10));
		let elapsed = curr - inputTime;
		return Math.round(elapsed / 1000);
	}

	columns = [
		{
			text: 'Environment',
			dataField: 'env',
			style: this.rowBgHighlightFormat
		},
		{
			text: 'Category',
			dataField: 'category',
			style: this.rowBgHighlightFormat,
			sort: true,
			filter: textFilter()
		},
		{
			text: 'Application',
			dataField: 'appId',
			style: this.rowBgHighlightFormat,
			sort: true,
			filter: textFilter()
		},
		{
			text: 'Version',
			dataField: 'version',
			sort: true,
			style: this.rowBgHighlightFormat,
			filter: textFilter()
		},
		{
			text: 'Deploy Time',
			dataField: 'lastDeployTime',
			style: this.rowBgHighlightFormat,
			formatter: this.deployDateFormatter
		},
		{
			text: 'Status Time',
			dataField: 'lastStatusPollTime',
			style: this.rowBgHighlightFormat,
			formatter: this.statusDateFormatter
		}
	];

	expandRow = {
		renderer: (row) => <AppDetails appId={row.appId} />,
		showExpandColumn: false,
		onExpand: (row, isExpand, rowIndex, e) => {
			this.rowSelectFormat(row, row);
		}
	};

	defaultSorted = [
		{
			dataField: 'appId',
			order: 'asc'
		}
	];

	fetchVersions() {
		fetch('/versions?env=' + this.state.env, {
			method: 'GET',
			headers: {
				ApiKey: 'pjZ4pSRtCkU1WiPCRIb92jzkJSqKBJ35RJVMiUS6',
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({ versionInfo: data });
			});
	}

	componentDidMount() {
		this.fetchVersions(this.state.versionInfo);
	}

	render() {
		return (
			<BootstrapTable
				bootstrap4
				striped
				hover
				search
				defaultSorted={this.defaultSorted}
				keyField="appId"
				columns={this.columns}
				data={this.state.versionInfo}
				filter={filterFactory()}
				expandRow={this.expandRow}
			/>
		);
	}
}

export default VersionInfo;
