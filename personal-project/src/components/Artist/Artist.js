import React, { Component } from 'react';
import { updateAlbum, updateAlbumArtwork } from '../../ducks/reducer';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import './Artist.css';

class Artist extends Component {
    constructor() {
        super();

        this.state = {
            artist: []
        }
    }

    componentDidMount() {
        axios.get(`/api/getArtist?artist=${this.props.artist}`).then(res => {
            this.setState({
                artist: res.data
            });
        });
    }

    render() {
        let mappedArtist = this.state.artist.map((album, i) => {
            return <ul key={i} className='album'>
                <Link to='/album' className='albumLink'>
                    <div onClick={() => {this.props.updateAlbum(album.album), this.props.updateAlbumArtwork(album.album_artwork)}} className='artistAlbum'>
                        <img src={album.album_artwork} />
                        <p className='albumTitle'>{album.album}</p>
                    </div>
                </Link>
            </ul>
        });
        return (
            <div className='artistBackground'>
                <h2 onClick={() => window.history.back()} className='back'>&lt; Back</h2>
                <div className='titleArtistContainer'>
                    <h1 className='titleArtist'>{this.props.artist}</h1>
                </div>
                <div className='filteredAlbumsContainer'>
                    {mappedArtist}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        artist: state.artist
    }
}

export default connect(mapStateToProps, { updateAlbum, updateAlbumArtwork })(Artist);