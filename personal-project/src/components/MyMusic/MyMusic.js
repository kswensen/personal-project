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
            return <ul key={i} className='song'>
                <iframe src={"https://open.spotify.com/embed?uri=" + song.songuri} width="80" height="80" frameborder="0" allowtransparency="true"></iframe>
                <div className='titleContainer'>
                    <p className='addSong' onClick={() => this.removeSong(song.songid)}>X</p>
                    <p>Title: {song.title}</p>
                </div>
                <div className='albumContainer'>
                    <p>Album: {song.album}</p>
                </div>
                <div className='artistContainer'>
                    <p>Artist: {splitArtists}</p>
                </div>
            </ul>
        });
        return (
            <div>
                {
                    this.props.user === undefined
                        ?
                        <h4>Please login to see your music</h4>
                        :
                        <div>
                            <h4>My Music</h4>
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