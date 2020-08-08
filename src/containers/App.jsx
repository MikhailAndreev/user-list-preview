import React, { Component } from 'react';
import { Switch,Route } from 'react-router-dom';

import UsersList from './UsersList/UsersList';

class App extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route path='/' exact component={UsersList}/>
                </Switch>
            </>
        );
    }
}

export default App;