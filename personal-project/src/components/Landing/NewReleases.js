import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './NewReleases.css';

class NewReleases extends Component {
    constructor() {
        super();

        this.state = { 
            artist: '',
            tracks: []
        }
    }

    componentDidMount() {
        axios.get(`/api/getAlbumTracks?id=${this.props.newRelease}`).then(res => {
            console.log(res.data);
            let artistArray = [];
            for (var j = 0; j < res.data[0].artists.length; j++) {
                artistArray.push(res.data[0].artists[j].name);
            }
            const splitArtists = artistArray.toLocaleString().replace(',', ', ');
            this.setState({
                tracks: res.data,
                artist: splitArtists
            });
        });
    }

    standardTime(time) {
        let seconds = (time / 1000) % 60
        let minutes = (time / (1000 * 60)) % 60
        let hours = (time / (1000 * 60 * 60)) % 24
        if (Math.round(hours) >= 1) {
            return Math.round(hours) + ":" + Math.round(minutes) + ":" + Math.round(seconds);
        } else if (Math.round(seconds) < 10) {
            return Math.round(minutes) + ":0" + Math.round(seconds);
        } else {
            return Math.round(minutes) + ":" + Math.round(seconds);
        }
    }

    render() {
        let mappedTracks = this.state.tracks.map((track, i) => {
            return <ul key={i} className='albumSong'>
                <p className='songNumber'>{i + 1}</p>
                <div className='titleContainer'>
                    <p>{track.name}</p>
                </div>
                {
                    track.explicit
                        ?
                        <h1 className='explicit'>EXPLICIT</h1>
                        :
                        null
                }
                <div className='time'>
                    <p>{this.standardTime(track.duration_ms)}</p>
                </div>
            </ul>
        });
        return (
            <div className='newReleasesBackground'>
                <h2 onClick={() => window.history.back()} className='back'>&lt; Back</h2>
                <div className='header'>
                    <div className='headerLeft'>
                        <img src={this.props.newReleaseImage} />
                    </div>
                    <div className='headerRight'>
                        <div className='playlistTitle'>
                            <h2 className='propAlbum'>{this.props.newReleaseTitle}</h2>
                        </div>
                        <p>By {this.state.artist}</p>
                    </div>
                </div>
                <div className='table'>
                    <p className='tableTitle'>Title</p>
                    <p className='time'>Duration</p>
                </div>
                {mappedTracks}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        newRelease: state.newRelease,
        newReleaseImage: state.newReleaseImage,
        newReleaseTitle: state.newReleaseTitle
    }
}

export default connect(mapStateToProps)(NewReleases);