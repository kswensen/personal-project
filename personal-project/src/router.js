import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import Browse from './components/Browse/Browse';
import MyMusic from './components/MyMusic/MyMusic';
import Search from './components/Search/Search';
import Details from './components/Details/Details';

export default (
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/browse' component={Browse}/>
        <Route path='/myMusic' component={MyMusic}/>
        <Route path='/search' component={Search}/>
        <Route path='/details' component={Details}/>
    </Switch>
)