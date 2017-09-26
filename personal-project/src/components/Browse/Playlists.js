import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Playlists.css';

export default class Playlists extends Component{
    constructor(){
        super();

        this.state = {
            playlists: []
        }
    }

    componentDidMount(){
        axios.get(`/api/getCategoryPlaylists?id=${this.props.location.query}`).then(res => {
            this.setState({
                playlists: res.data
            })
        });
    }

    render(){
        const mappedPlaylists = this.state.playlists.map((playlist, i) => {
            return <ul key={i} className='album'>
                <Link to={{ pathname: '/browse/playlists/tracks/', query: playlist.id }} className='link'>
                    <img src={playlist.images[0].url}/>
                    <p>{playlist.name}</p>
                </Link>
            </ul>
        });
        return(
            <div>
                <h1>{this.props.location.query}</h1>
                {mappedPlaylists}
            </div>
        )
    }
}