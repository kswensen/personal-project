import axios from 'axios';

const initialState = {
    searchTerm: "",
    fireRedirect: false,
    user: {},
    first_name: '',
    last_name: '',
    favorite_genre: '',
    songOffset: -20,
    artistOffset: -20,
    albumOffset: -20,
    category_name: '',
    category_id: '',
    playlist_id: '',
    hidden: true,
    album: '',
    album_artwork: '',
    artist: '',
    newRelease: '',
    newReleaseImage: '',
    newReleaseTitle: ''
}

const UPDATE_SEARCH_TERM = "UPDATE_SEARCH_TERM";
const UPDATE_FIRE_REDIRECT = "UPDATE_FIRE_REDIRECT";
const GET_USER_INFO = 'GET_USER_INFO';
const UPDATE_FIRST_NAME = 'UPDATE_FIRST_NAME';
const UPDATE_LAST_NAME = 'UPDATE_LAST_NAME';
const UPDATE_FAVORITE_GENRE = 'UPDATE_FAVORITE_GENRE';
const UPDATE_USER = 'UPDATE_USER';
const CLEAR_USER = 'CLEAR_USER';
const UPDATE_SONG_OFFSET = 'UPDATE_SONG_OFFSET';
const UPDATE_ARTIST_OFFSET = 'UPDATE_ARTIST_OFFSET';
const UPDATE_ALBUM_OFFSET = 'UPDATE_ALBUM_OFFSET';
const RESET_OFFSET = 'RESET_OFFSET';
const UPDATE_CATEGORY_NAME = 'UPDATE_CATEGORY_NAME';
const UPDATE_CATEGORY_ID = 'UPDATE_CATEGORY_ID';
const UPDATE_PLAYLIST_ID = 'UPDATE_PLAYLIST_ID';
const TOGGLE_HIDDEN = 'TOGGLE_HIDDEN';
const UPDATE_ALBUM = 'UPDATE_ALBUM';
const UPDATE_ALBUM_ARTWORK = 'UPDATE_ALBUM_ARTWORK';
const UPDATE_ARTIST = 'UPDATE_ARTIST';
const UPDATE_NEW_RELEASE = 'UPDATE_NEW_RELEASE';
const UPDATE_NEW_RELEASE_IMAGE = 'UPDATE_NEW_RELEASE_IMAGE';
const UPDATE_NEW_RELEASE_TITLE = 'UPDATE_NEW_RELEASE_TITLE';

export function search(entered){
    return {
        type: UPDATE_SEARCH_TERM,
        payload: entered
    }
}

export function updateFireRedirect(bool){
    return {
        type: UPDATE_FIRE_REDIRECT,
        payload: bool
    }
}

export function getUserInfo(){
    let userInfo = axios.get('/auth/me').then(res => {
        if(res.data !== 'User not found'){
            return res.data[0];
        }
    });
    return {
        type: GET_USER_INFO,
        payload: userInfo
    }
}

export function updateFirst(first){
    return{
        type: UPDATE_FIRST_NAME,
        payload: first
    }
}

export function updateLast(last){
    return{
        type: UPDATE_LAST_NAME,
        payload: last
    }
}

export function updateGenre(genre){
    return{
        type: UPDATE_FAVORITE_GENRE,
        payload: genre
    }
}

export function updateUser(first, last, genre){
    let newInfo = axios.put(`/api/updateUserInfo?first_name=${first}&last_name=${last}&favorite_genre=${genre}`).then(res => {
        alert('User Updated');
        return res.data[0];
    });
    return{
        type: UPDATE_USER,
        payload: newInfo
    }
}

export function clearUser(){
    return{
        type: CLEAR_USER,
        payload: {}
    }
}

export function updateSongOffset(num){
    return {
        type: UPDATE_SONG_OFFSET,
        payload: num
    }
}

export function updateArtistOffset(num){
    return {
        type: UPDATE_ARTIST_OFFSET,
        payload: num
    }
}

export function updateAlbumOffset(num){
    return {
        type: UPDATE_ALBUM_OFFSET,
        payload: num
    }
}

export function resetOffset(){
    return {
        type: RESET_OFFSET,
        payload: 0
    }
}

export function updateCategoryName(category){
    return{
        type: UPDATE_CATEGORY_NAME,
        payload: category
    }
}

export function updateCategoryID(id){
    return{
        type: UPDATE_CATEGORY_ID,
        payload: id
    }
}

export function updatePlaylistID(id){
    return{
        type: UPDATE_PLAYLIST_ID,
        payload: id
    }
}

export function toggleHidden(){
    return{
        type: TOGGLE_HIDDEN
    }
}

export function updateAlbum(album){
    return {
        type: UPDATE_ALBUM,
        payload: album
    }
}

export function updateAlbumArtwork(artwork){
    return {
        type: UPDATE_ALBUM_ARTWORK,
        payload: artwork
    }
}

export function updateArtist(artist){
    return {
        type: UPDATE_ARTIST,
        payload: artist
    }
}

export function updateNewRelease(album){
    return {
        type: UPDATE_NEW_RELEASE,
        payload: album
    }
}

export function updateNewReleaseImage(url){
    return {
        type: UPDATE_NEW_RELEASE_IMAGE,
        payload: url
    }
}

export function updateNewReleaseTitle(title){
    return {
        type: UPDATE_NEW_RELEASE_TITLE,
        payload: title
    }
}

export default function reducer(state = initialState, action){
    switch(action.type){

        case UPDATE_SEARCH_TERM:
            return Object.assign({}, state, {searchTerm: action.payload});

        case UPDATE_FIRE_REDIRECT:
            return Object.assign({}, state, {fireRedirect: action.payload});

        case GET_USER_INFO + "_FULFILLED":
            return Object.assign({}, state, {user: action.payload});

        case UPDATE_FIRST_NAME:
            return Object.assign({}, state, {first_name: action.payload});

        case UPDATE_LAST_NAME:
            return Object.assign({}, state, {last_name: action.payload});

        case UPDATE_FAVORITE_GENRE:
            return Object.assign({}, state, {favorite_genre: action.payload});

        case UPDATE_USER + "_FULFILLED":
            return Object.assign({}, state, {user: action.payload});

        case CLEAR_USER:
            return Object.assign({}, state, {user: action.payload});

        case UPDATE_SONG_OFFSET:
            return Object.assign({}, state, {songOffset: action.payload});

        case UPDATE_ARTIST_OFFSET:
            return Object.assign({}, state, {artistOffset: action.payload});

        case UPDATE_ALBUM_OFFSET:
            return Object.assign({}, state, {albumOffset: action.payload});

        case RESET_OFFSET:
            return Object.assign({}, state, {songOffset: action.payload, artistOffset: action.payload, albumOffset: action.payload});
        
        case UPDATE_CATEGORY_NAME:
            return Object.assign({}, state, {category_name: action.payload});

        case UPDATE_CATEGORY_ID:
            return Object.assign({}, state, {category_id: action.payload});

        case UPDATE_PLAYLIST_ID:
            return Object.assign({}, state, {playlist_id: action.payload}); 

        case TOGGLE_HIDDEN:
            return Object.assign({}, state, {hidden: !state.hidden});

        case UPDATE_ALBUM:
            return Object.assign({}, state, {album: action.payload});

        case UPDATE_ALBUM_ARTWORK:
            return Object.assign({}, state, {album_artwork: action.payload});

        case UPDATE_ARTIST:
            return Object.assign({}, state, {artist: action.payload});

        case UPDATE_NEW_RELEASE:
            return Object.assign({}, state, {newRelease: action.payload});

        case UPDATE_NEW_RELEASE_IMAGE:
            return Object.assign({}, state, {newReleaseImage: action.payload});

        case UPDATE_NEW_RELEASE_TITLE:
            return Object.assign({}, state, {newReleaseTitle: action.payload});
             
        default:
            return state;
    }
}