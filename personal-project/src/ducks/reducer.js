import axios from 'axios';

let initialState = {
    searchTerm: "",
    searchID: 0, 
    fireRedirect: false,
    loggedIn: false,
    user: {},
    songOffset: 0,
    artistOffset: 0,
    albumOffset: 0
}

const UPDATE_SEARCH_TERM = "UPDATE_SEARCH_TERM";
const UPDATE_SEARCH_ID = "UPDATE_SEARCHID";
const UPDATE_FIRE_REDIRECT = "UPDATE_FIRE_REDIRECT";
const UPDATE_LOGGED_IN = "UPDATE_LOGGED_IN";
const GET_USER_INFO = 'GET_USER_INFO';
const UPDATE_SONG_OFFSET = 'UPDATE_SONG_OFFSET';
const UPDATE_ARTIST_OFFSET = 'UPDATE_ARTIST_OFFSET';
const UPDATE_ALBUM_OFFSET = 'UPDATE_ALBUM_OFFSET';
const RESET_OFFSET = 'RESET_OFFSET';

export function search(entered){
    return {
        type: UPDATE_SEARCH_TERM,
        payload: entered
    }
}

export function updateSearchID(num){
    return {
        type: UPDATE_SEARCH_ID,
        payload: num
    }
}

export function updateFireRedirect(bool){
    return {
        type: UPDATE_FIRE_REDIRECT,
        payload: bool
    }
}

export function updateLoggedIn(bool){
    return {
        type: UPDATE_LOGGED_IN,
        payload: bool
    }
}

export function getUserInfo(){
    const userInfo = axios.get('http://localhost:3030/auth/me').then(res => {
        return res.data;
    });

    return {
        type: GET_USER_INFO,
        payload: userInfo
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

export default function reducer(state = initialState, action){
    switch(action.type){
        case UPDATE_SEARCH_TERM:
            return Object.assign({}, state, {searchTerm: action.payload});
        case UPDATE_SEARCH_ID:
            return Object.assign({}, state, {searchID: action.payload});
        case UPDATE_FIRE_REDIRECT:
            return Object.assign({}, state, {fireRedirect: action.payload});
        case UPDATE_LOGGED_IN:
            return Object.assign({}, state, {loggedIn: action.payload});
        case GET_USER_INFO + "_FULFILLED":
            return Object.assign({}, state, {user: action.payload});
        case UPDATE_SONG_OFFSET:
            return Object.assign({}, state, {songOffset: action.payload});
        case UPDATE_ARTIST_OFFSET:
            return Object.assign({}, state, {artistOffset: action.payload});
        case UPDATE_ALBUM_OFFSET:
            return Object.assign({}, state, {albumOffset: action.payload});
        case RESET_OFFSET:
            return Object.assign({}, state, {songOffset: action.payload, artistOffset: action.payload, albumOffset: action.payload});  
        default:
            return state;
    }
}