import "../stylesheets/Page.css";
import React from "react";
import { render } from "react-dom";
import App from "../components/App";
import Rails from '@rails/ujs';

Rails.start();

document.addEventListener("DOMContentLoaded", () => {
  render(
    <App />,
    document.body.appendChild(document.createElement("div"))
  );
});
