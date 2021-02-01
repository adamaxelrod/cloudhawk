import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import VersionInfo from './components/VersionInfo';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			env: ''
		};
	}

	render() {
		return (
			<Router>
				<div>
					<div class="App-header">
						<h2 class="App-header-text">
							<img src="arlo-108.png" alt="logo" />
							CloudHawk Dashboard
						</h2>
					</div>
					<nav>
						<div class="row align-items-start">
							<div class="col">
								<Alert className="alert-info">
									<Link to="/goldendev">
										<b>GoldenDev</b>
									</Link>
								</Alert>
							</div>
							<div class="col">
								<Alert className="alert-info">
									<Link to="/goldenqa">
										<b>GoldenQA</b>
									</Link>
								</Alert>
							</div>
							<div class="col">
								<Alert className="alert-info">
									<Link to="/production">
										<b>Production</b>
									</Link>
								</Alert>
							</div>
						</div>
					</nav>

					<Switch>
						<Route key="goldendev" path="/goldendev">
							<VersionInfo env="goldendev" />
						</Route>
						<Route key="goldenqa" path="/goldenqa">
							<VersionInfo env="goldenqa" />
						</Route>
						<Route key="production" path="/production">
							<VersionInfo env="production" />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
