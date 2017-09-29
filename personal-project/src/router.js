import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import Browse from './components/Browse/Browse';
import MyMusic from './components/MyMusic/MyMusic';
import Search from './components/Search/Search';
import Details from './components/Details/Details';
import Profile from './components/Profile/Profile';
import Playlists from './components/Browse/Playlists';
import Tracks from './components/Browse/Tracks';

export default (
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/myMusic' component={MyMusic}/>
        <Route path='/search' component={Search}/>
        <Route path='/details' component={Details}/>
        <Route path='/profile' component={Profile}/>
        <Switch>
            <Route exact path='/browse' component={Browse}/>
            <Switch>
                <Route path='/browse/playlists/tracks' component={Tracks}/>
                <Route path='/browse/playlists' component={Playlists}/>
            </Switch>
        </Switch>
    </Switch>
)