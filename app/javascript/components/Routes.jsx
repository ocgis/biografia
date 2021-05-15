import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IndexPerson from './IndexPerson';
import ShowPerson from './ShowPerson';
import ShowNote from './ShowNote';
import IndexMedium from './IndexMedium';
import ShowMedium from './ShowMedium';
import IndexEvent from './IndexEvent';
import ShowEvent from './ShowEvent';
import ShowEventDate from './ShowEventDate';
import IndexAddress from './IndexAddress';
import ShowAddress from './ShowAddress';
import IndexThing from './IndexThing';
import ShowThing from './ShowThing';
import ShowRelationship from './ShowRelationship';
import IndexTransfer from './IndexTransfer';
import ShowTransfer from './ShowTransfer';
import IndexExport from './IndexExport';
import ShowExport from './ShowExport';

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
        path="/r/media"
        exact
        component={IndexMedium}
      />
      <Route
        path="/r/events/:id"
        exact
        component={ShowEvent}
      />
      <Route
        path="/r/events"
        exact
        component={IndexEvent}
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
      <Route
        path="/r/addresses"
        exact
        component={IndexAddress}
      />
      <Route
        path="/r/things/:id"
        exact
        component={ShowThing}
      />
      <Route
        path="/r/things"
        exact
        component={IndexThing}
      />
      <Route
        path="/r/relationships/:id"
        exact
        component={ShowRelationship}
      />
      <Route
        path="/r/transfers/:id"
        exact
        component={ShowTransfer}
      />
      <Route
        path="/r/transfers"
        exact
        component={IndexTransfer}
      />
      <Route
        path="/r/exports/:id"
        exact
        component={ShowExport}
      />
      <Route
        path="/r/exports"
        exact
        component={IndexExport}
      />
    </Switch>
  </Router>
);
