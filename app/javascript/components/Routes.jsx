import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IndexPerson from './IndexPerson';
import ShowPerson from './ShowPerson';
import ShowNote from './ShowNote';
import ShowMedium from './ShowMedium';
import ShowEvent from './ShowEvent';
import ShowEventDate from './ShowEventDate';
import ShowAddress from './ShowAddress';

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
        path="/r/event_dates/:id"
        exact
        component={ShowEventDate}
      />
      <Route
        path="/r/addresses/:id"
        exact
        component={ShowAddress}
      />
    </Switch>
  </Router>
);
