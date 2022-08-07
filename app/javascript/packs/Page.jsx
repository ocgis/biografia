import '../stylesheets/Page.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Rails from '@rails/ujs';
import App from '../components/App';

Rails.start();

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.body.appendChild(document.createElement('div')));
  root.render(
    <App />,
  );
});
