import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    /*     <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div> */

    <div class="container-fluid">
      <h1>My First Bootstrap Page</h1>
      <p>This is some text.</p>
      <h1>Responsive Containers</h1>
      <p>Resize the browser window to see the effect.</p>
      <div class="container-sm border">.container-sm</div>
      <div class="container-md mt-3 border">.container-md</div>
      <div class="container-lg mt-3 border">.container-lg</div>
      <div class="container-xl mt-3 border">.container-xl</div>
      <h2>Hoverable Dark Table</h2>
      <p>The .table-hover class adds a hover effect (grey background color) on table rows:</p>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr>
          <tr>
            <td>Mary</td>
            <td>Moe</td>
            <td>mary@example.com</td>
          </tr>
          <tr>
            <td>July</td>
            <td>Dooley</td>
            <td>july@example.com</td>
          </tr>
        </tbody>
      </table>
      <h2>Alerts</h2>
      <p>The button with class="close" and data-dismiss="alert" is used to close the alert box.</p>
      <p>The alert-dismissible class adds some extra padding to the close button.</p>
      <div class="alert alert-success alert-dismissible">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Success!</strong> This alert box could indicate a successful or positive action.
  </div>
    </div>
  );
}

export default App;
