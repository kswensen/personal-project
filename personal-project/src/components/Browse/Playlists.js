import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updatePlaylistID } from '../../ducks/reducer';
import axios from 'axios';
import './Playlists.css';

class Playlists extends Component{
    constructor(){
        super();

        this.state = {
            playlists: []
        }
    }

    componentDidMount(){
        axios.get(`/api/getCategoryPlaylists?id=${this.props.category_id}`).then(res => {
            this.setState({
                playlists: res.data
            })
        });
    }

    render(){
        const mappedPlaylists = this.state.playlists.map((playlist, i) => {
            return <ul key={i} className='playlistAlbum'>
                <Link to='/browse/playlists/tracks/' className='link' onClick={() => this.props.updatePlaylistID(playlist.id)}>
                    <img src={playlist.images[0].url}/>
                    <div className='playlistAlbumDetails'>
                        <p>{playlist.name}</p>
                    </div>
                </Link>
            </ul>
        });
        return(
            <div className='playlistsBackground'>
                <div className='headerContainer'>
                    <h2 onClick={() => window.history.back()} className='back'>&lt; Back</h2>
                    <h1 className='categoryTitle'>{this.props.category_name}</h1>
                    <div></div>
                </div>
                <div className='playlistContainer'>
                    {mappedPlaylists}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        category_id: state.category_id,
        category_name: state.category_name,
        playlist_id: state.playlist_id
    }
}

export default connect(mapStateToProps, { updatePlaylistID })(Playlists);