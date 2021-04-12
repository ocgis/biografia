import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IndexPerson } from './Person';
import { ShowPerson } from './ShowPerson';
import { ShowNote } from './ShowNote';

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
      <Route
        path="/r/notes/:id"
        exact
        component={ShowNote}
      />
    </Switch>
  </Router>
);
