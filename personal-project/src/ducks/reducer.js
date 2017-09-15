let initialState = {
    searchTerm: "",
    searchID: 0, 
    fireRedirect: false
}

const UPDATE_SEARCH_TERM = "UPDATE_SEARCH_TERM";
const UPDATE_SEARCH_ID = "UPDATE_SEARCHID";
const UPDATE_FIRE_REDIRECT = "UPDATE_FIRE_REDIRECT";

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

export default function reducer(state = initialState, action){
    switch(action.type){
        case UPDATE_SEARCH_TERM:
            return Object.assign({}, state, {searchTerm: action.payload});
        case UPDATE_SEARCH_ID:
            return Object.assign({}, state, {searchID: action.payload});
        case UPDATE_FIRE_REDIRECT:
            return Object.assign({}, state, {fireRedirect: action.payload});
        default:
            return state;
    }
}