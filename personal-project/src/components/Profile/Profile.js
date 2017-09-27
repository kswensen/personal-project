import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateFirst, updateLast, updateUser, updateGenre, toggleHidden } from '../../ducks/reducer';
import './Profile.css';

class Profile extends Component{

    update(){
        this.props.updateUser(this.props.first_name, this.props.last_name, this.props.favorite_genre);
        this.props.toggleHidden();
    }

    cancel(){
        this.props.toggleHidden();
        this.props.updateFirst('');
        this.props.updateLast('');
    }

    render(){
        return(
            <div>
                <h4>Profile</h4>
                <div>
                    <h3>First Name: </h3>
                    <input defaultValue={this.props.user.first_name} onChange={(e) => this.props.updateFirst(e.target.value)}/>
                </div>
                <div>
                    <h3>Last Name: </h3>
                    <input defaultValue={this.props.user.last_name} onChange={(e) => this.props.updateLast(e.target.value)}/>
                </div>
                <div>
                    <h3>Favorite Genre: </h3>
                    <input defaultValue={this.props.user.favorite_genre} onChange={(e) => this.props.updateGenre(e.target.value)}/>
                </div>
                <button onClick={() => this.update()}>Update User</button>
                <button onClick={() => this.cancel()}>Cancel</button>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user,
        first_name: state.first_name,
        last_name: state.last_name,
        favorite_genre: state.favorite_genre,
        hidden: state.hidden
    }
}

export default connect(mapStateToProps, { updateFirst, updateLast, updateUser, updateGenre, toggleHidden })(Profile);