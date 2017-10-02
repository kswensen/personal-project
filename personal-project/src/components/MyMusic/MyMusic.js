import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateAlbum, updateAlbumArtwork, updateArtist } from '../../ducks/reducer';
import { Link } from 'react-router-dom';
import axios from 'axios';
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

    truncateString(str, num) {
        if (num >= str.length) {
            str = str.slice(str, num);
            return str;
        }
        else if (num <= 3) {
            str = str.slice(str, num) + "...";
            return str;
        }
        else {
            str = str.slice(str, num - 3) + "...";
            return str;
        }
    }

    render() {
        const mappedSongs = this.state.mySongs.map((song, i) => {
            const splitArtists = song.artist.toLocaleString().replace(',', ', ');
            return <ul key={i} className='myMusicSong'>
                <iframe src={"https://open.spotify.com/embed?uri=" + song.songuri} width="80" height="80" frameborder="0" allowtransparency="true"></iframe>
                <p className='deleteSong' onClick={() => this.removeSong(song.songid)}>&#10010;</p>
                <div className='titleContainer'>
                    <p>{this.truncateString(song.title, 52)}</p>
                </div>
                <div className='albumContainer'>
                    <Link to='/album' className='albumLink'>
                        <p onClick={() => {this.props.updateAlbum(song.album), this.props.updateAlbumArtwork(song.album_artwork)}}>{this.truncateString(song.album, 30)}</p>
                    </Link>
                </div>
                <div className='artistContainer'>
                    <Link to='/artist' className='albumLink'>
                        <p onClick={() => this.props.updateArtist(splitArtists)}>{this.truncateString(splitArtists, 50)}</p>
                    </Link>
                </div>
            </ul>
        });
        return (
            <div>
                {
                    this.props.user === undefined
                        ?
                        <div className='noUserContainer'>
                            <h4 className='noUser'>Please login to see your music</h4>
                            <a href={process.env.REACT_APP_LOGIN}><button className='noUserLogin'>Login</button></a>
                            <footer className='bottom'></footer>
                        </div>
                        :
                        <div className='userContainer'>
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

export default connect(mapStateToProps, { updateAlbum, updateAlbumArtwork, updateArtist })(MyMusic);