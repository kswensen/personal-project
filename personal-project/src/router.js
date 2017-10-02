import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import NewReleases from './components/Landing/NewReleases';
import Browse from './components/Browse/Browse';
import MyMusic from './components/MyMusic/MyMusic';
import Search from './components/Search/Search';
import Album from './components/Album/Album';
import Artist from './components/Artist/Artist';
import Profile from './components/Profile/Profile';
import Playlists from './components/Browse/Playlists';
import Tracks from './components/Browse/Tracks';

export default (
    <Switch>
        <Route exact path='/' component={Landing}/>
        <Route path='/newReleases' component={NewReleases}/>
        <Route path='/myMusic' component={MyMusic}/>
        <Route path='/search' component={Search}/>
        <Route path='/album' component={Album}/>
        <Route path='/artist' component={Artist}/>
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