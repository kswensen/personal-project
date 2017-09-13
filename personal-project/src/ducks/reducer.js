const initialState = {
    searchTerm: ""
}

const UPDATE_SEARCH_TERM = "UPDATE_SEARCH_TERM";

export function search(entered){
    return {
        type: UPDATE_SEARCH_TERM,
        payload: entered
    }
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case UPDATE_SEARCH_TERM:
            return Object.assign({}, state, {searchTerm: action.payload})
        default:
            return state;
    }
}