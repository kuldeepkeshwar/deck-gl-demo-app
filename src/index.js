import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css"
import "./styles.scss";
import routes from './Pages';

function Header({ routes }) {
  return (
    <nav className="header">
      <ul>
        {routes.map(({ path, label }) => (
          <li key={path}>
            <Link to={path}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const App = ({ routes }) => {
  const style = {
    height: window.screen.availHeight - 150
  };
  return (
    <Router>
      <div>
        <Header routes={routes} />
        <div style={style} className="container">
          {routes.map(({ path, exact, component }) => (
            <Route key={path} path={path} exact={exact} component={component} />
          ))}
        </div>
      </div>
    </Router>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App routes={routes}/>, rootElement);
