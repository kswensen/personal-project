import axios from 'axios';

const initialState = {
    searchTerm: "",
    fireRedirect: false,
    user: {},
    first_name: '',
    last_name: '',
    favorite_genre: '',
    songOffset: 0,
    artistOffset: 0,
    albumOffset: 0
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
        default:
            return state;
    }
}