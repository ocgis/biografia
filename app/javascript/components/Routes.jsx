import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IndexPerson, ShowPerson } from './Person';

export default (
  <Router>
    <Switch>
      <Route
        path="/r/people/:id"
        exact
        component={ShowPerson}
      />
      <Route
        path="/r/people"
        exact
        component={IndexPerson}
      />
    </Switch>
  </Router>
);
