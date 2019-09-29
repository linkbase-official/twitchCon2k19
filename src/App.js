import React from 'react';
import logo from './logo.svg';
import './App.css';
import Gallery from './components/Gallery.js';
import Config from './components/Config.js'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route  path="/">
            <Gallery />
          </Route>
          <Route exact path="/config">
            <Config />
          </Route>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
