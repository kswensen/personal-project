import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './MyMusic.css';

class MyMusic extends Component {
    constructor() {
        super();

        this.state = {
            mySongs: []
        }
    }

    componentDidMount() {
        axios.get('/api/getUserSongs').then(res => {
            this.setState({
                mySongs: res.data
            });
        });
    }

    removeSong(songid) {
        axios.delete(`/api/removeFavorite?songid=${songid}`).then(res => {
            alert(res.data);
        }).then(deleted => {
            axios.get('/api/getUserSongs').then(res => {
                this.setState({
                    mySongs: res.data
                })
            });
        });
    }

    render() {
        const mappedSongs = this.state.mySongs.map((song, i) => {
            const splitArtists = song.artist.toLocaleString().replace(',', ', ');
            return <ul key={i} className='myMusicSong'>
                <iframe src={"https://open.spotify.com/embed?uri=" + song.songuri} width="80" height="80" frameborder="0" allowtransparency="true"></iframe>
                <p className='deleteSong' onClick={() => this.removeSong(song.songid)}>X</p>
                <div className='titleContainer'>
                    <p>{song.title}</p>
                </div>
                <div className='albumContainer'>
                    <p>{song.album}</p>
                </div>
                <div className='artistContainer'>
                    <p>{splitArtists}</p>
                </div>
            </ul>
        });
        return (
            <div className='myMusicBackground'>
                {
                    this.props.user === undefined
                        ?
                        <div className='noUserContainer'>
                            <h4 className='noUser'>Please login to see your music</h4>
                            <a href={process.env.REACT_APP_LOGIN}><button className='noUserLogin'>Login</button></a>
                        </div>
                        :
                        <div>
                            <div className='musicTitleContainer'>
                                <h4 className='musicTitle'>My Music</h4>
                            </div>
                            <div className='table'>
                                <p className='tableTitle'>Title</p>
                                <p className='tableAlbum'>Album</p>
                                <p className='tableArtist'>Artist</p>
                            </div>
                            {mappedSongs}
                        </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(MyMusic);