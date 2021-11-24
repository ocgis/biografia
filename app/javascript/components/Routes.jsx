import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IndexPerson from './IndexPerson';
import ShowPerson from './ShowPerson';
import ShowNote from './ShowNote';
import SearchMedium from './SearchMedium';
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
import IndexUser from './IndexUser';
import ShowUser from './ShowUser';
import { webUrl } from './Mappings';

export default (
  <Router>
    <Switch>
      <Route
        path={webUrl('Person', ':id')}
        exact
        component={ShowPerson}
      />
      <Route
        path={webUrl('Person')}
        exact
        component={IndexPerson}
      />
      <Route
        path={webUrl('Note', ':id')}
        exact
        component={ShowNote}
      />
      <Route
        path={webUrl('Medium', 'search')}
        exact
        component={SearchMedium}
      />
      <Route
        path={webUrl('Medium', ':id')}
        exact
        component={ShowMedium}
      />
      <Route
        path={webUrl('Medium')}
        exact
        component={IndexMedium}
      />
      <Route
        path={webUrl('Event', ':id')}
        exact
        component={ShowEvent}
      />
      <Route
        path={webUrl('Event')}
        exact
        component={IndexEvent}
      />
      <Route
        path={webUrl('EventDate', ':id')}
        exact
        component={ShowEventDate}
      />
      <Route
        path={webUrl('Address', ':id')}
        exact
        component={ShowAddress}
      />
      <Route
        path={webUrl('Address')}
        exact
        component={IndexAddress}
      />
      <Route
        path={webUrl('Thing', ':id')}
        exact
        component={ShowThing}
      />
      <Route
        path={webUrl('Thing')}
        exact
        component={IndexThing}
      />
      <Route
        path={webUrl('Relationship', ':id')}
        exact
        component={ShowRelationship}
      />
      <Route
        path={webUrl('Transfer', ':id')}
        exact
        component={ShowTransfer}
      />
      <Route
        path={webUrl('Transfer')}
        exact
        component={IndexTransfer}
      />
      <Route
        path={webUrl('Export', ':id')}
        exact
        component={ShowExport}
      />
      <Route
        path={webUrl('Export')}
        exact
        component={IndexExport}
      />
      <Route
        path={webUrl('User', ':id')}
        exact
        component={ShowUser}
      />
      <Route
        path={webUrl('User')}
        exact
        component={IndexUser}
      />
    </Switch>
  </Router>
);
