import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import VersionInfo from './components/VersionInfo';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Router>
				<div>
					<div>
						<h1>
							<img src="arlo-108.png" alt="logo" />
							CloudHawk Dashboard
						</h1>
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
						<Route path="/goldendev">
							<VersionInfo env="goldendev" />
						</Route>
						<Route path="/goldenqa">
							<VersionInfo env="goldenqa" />
						</Route>
						<Route path="/production">
							<VersionInfo env="production" />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
