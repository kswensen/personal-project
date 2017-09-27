import React, { Component } from 'react';
import NavBar from './components/NavBar/NavBar';
import router from './router';
import './reset.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        {router}
      </div>
    );
  }
}

export default App;
