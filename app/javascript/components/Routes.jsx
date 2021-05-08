import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IndexPerson } from './Person';
import { ShowPerson } from './ShowPerson';
import { ShowNote } from './ShowNote';
import { ShowMedium } from './ShowMedium';
import { ShowEvent } from './ShowEvent';
import { ShowAddress } from './ShowAddress';

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
      <Route
        path="/r/media/:id"
        exact
        component={ShowMedium}
      />
      <Route
        path="/r/events/:id"
        exact
        component={ShowEvent}
      />
      <Route
        path="/r/addresses/:id"
        exact
        component={ShowAddress}
      />
    </Switch>
  </Router>
);
