import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IndexPerson, ShowPerson, VersionPerson } from './Person';
import { ShowNote, VersionNote } from './Note';
import SearchMedium from './SearchMedium';
import { IndexMedium, ShowMedium, VersionMedium } from './Medium';
import { IndexEvent, ShowEvent, VersionEvent } from './Event';
import { ShowEventDate, VersionEventDate } from './EventDate';
import { IndexAddress, ShowAddress, VersionAddress } from './Address';
import { IndexThing, ShowThing, VersionThing } from './Thing';
import { ShowRelationship, VersionRelationship } from './Relationship';
import { IndexTransfer, ShowTransfer } from './Transfer';
import { IndexExport, ShowExport } from './Export';
import { IndexUser, ShowUser } from './User';
import { webUrl } from './Mappings';

export default (
  <Router>
    <Switch>
      <Route
        path={webUrl('Person', ':id', 'examine')}
        exact
        component={VersionPerson}
      />
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
        path={webUrl('Note', ':id', 'examine')}
        exact
        component={VersionNote}
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
        path={webUrl('Medium', ':id', 'examine')}
        exact
        component={VersionMedium}
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
        path={webUrl('Event', ':id', 'examine')}
        exact
        component={VersionEvent}
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
        path={webUrl('EventDate', ':id', 'examine')}
        exact
        component={VersionEventDate}
      />
      <Route
        path={webUrl('EventDate', ':id')}
        exact
        component={ShowEventDate}
      />
      <Route
        path={webUrl('Address', ':id', 'examine')}
        exact
        component={VersionAddress}
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
        path={webUrl('Thing', ':id', 'examine')}
        exact
        component={VersionThing}
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
        path={webUrl('Relationship', ':id', 'examine')}
        exact
        component={VersionRelationship}
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
