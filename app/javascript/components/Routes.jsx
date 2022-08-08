import React from 'react';
import {
  BrowserRouter as Router, Navigate, Route, Routes,
} from 'react-router-dom';
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
    <Routes>
      <Route
        path={webUrl('Person', ':id', 'examine')}
        exact
        element={<VersionPerson />}
      />
      <Route
        path={webUrl('Person', ':id')}
        exact
        element={<ShowPerson />}
      />
      <Route
        path={webUrl('Person')}
        exact
        element={<IndexPerson />}
      />
      <Route
        path={webUrl('Note', ':id', 'examine')}
        exact
        element={<VersionNote />}
      />
      <Route
        path={webUrl('Note', ':id')}
        exact
        element={<ShowNote />}
      />
      <Route
        path={webUrl('Medium', 'search')}
        exact
        element={<SearchMedium />}
      />
      <Route
        path={webUrl('Medium', ':id', 'examine')}
        exact
        element={<VersionMedium />}
      />
      <Route
        path={webUrl('Medium', ':id')}
        exact
        element={<ShowMedium />}
      />
      <Route
        path={webUrl('Medium')}
        exact
        element={<IndexMedium />}
      />
      <Route
        path={webUrl('Event', ':id', 'examine')}
        exact
        element={<VersionEvent />}
      />
      <Route
        path={webUrl('Event', ':id')}
        exact
        element={<ShowEvent />}
      />
      <Route
        path={webUrl('Event')}
        exact
        element={<IndexEvent />}
      />
      <Route
        path={webUrl('EventDate', ':id', 'examine')}
        exact
        element={<VersionEventDate />}
      />
      <Route
        path={webUrl('EventDate', ':id')}
        exact
        element={<ShowEventDate />}
      />
      <Route
        path={webUrl('Address', ':id', 'examine')}
        exact
        element={<VersionAddress />}
      />
      <Route
        path={webUrl('Address', ':id')}
        exact
        element={<ShowAddress />}
      />
      <Route
        path={webUrl('Address')}
        exact
        element={<IndexAddress />}
      />
      <Route
        path={webUrl('Thing', ':id', 'examine')}
        exact
        element={<VersionThing />}
      />
      <Route
        path={webUrl('Thing', ':id')}
        exact
        element={<ShowThing />}
      />
      <Route
        path={webUrl('Thing')}
        exact
        element={<IndexThing />}
      />
      <Route
        path={webUrl('Relationship', ':id', 'examine')}
        exact
        element={<VersionRelationship />}
      />
      <Route
        path={webUrl('Relationship', ':id')}
        exact
        element={<ShowRelationship />}
      />
      <Route
        path={webUrl('Transfer', ':id')}
        exact
        element={<ShowTransfer />}
      />
      <Route
        path={webUrl('Transfer')}
        exact
        element={<IndexTransfer />}
      />
      <Route
        path={webUrl('Export', ':id')}
        exact
        element={<ShowExport />}
      />
      <Route
        path={webUrl('Export')}
        exact
        element={<IndexExport />}
      />
      <Route
        path={webUrl('User', ':id')}
        exact
        element={<ShowUser />}
      />
      <Route
        path={webUrl('User')}
        exact
        element={<IndexUser />}
      />
      <Route
        path="*"
        element={<Navigate to={webUrl('Person')} replace />}
      />
    </Routes>
  </Router>
);
