import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import UsersList from "./UsersList/UsersList";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" exact component={UsersList} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
