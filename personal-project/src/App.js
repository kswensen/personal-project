import React, { Component } from 'react';
import NavBar from './components/NavBar/NavBar';
import router from './router';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='color'>
        <NavBar />
        {router}
      </div>
    );
  }
}

export default App;
