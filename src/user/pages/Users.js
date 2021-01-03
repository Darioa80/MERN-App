import React from 'react';
//Can see a list of users and how many places they have shared
//Goal is to output a list of users
import UsersList from '../components/UsersList';


const Users = () =>{
    const USERS = [{id: 'u1', 
    name: 'Max Schwarz', 
    image: 'https://assets.pokemon.com/assets/cms2/img/watch-pokemon-tv/seasons/season19/season19_ep11_ss01.jpg',
    places: 7}];

    return <UsersList items = {USERS}/>;
}

export default Users;