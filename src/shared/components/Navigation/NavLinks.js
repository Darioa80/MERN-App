import React, { useContext }from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props =>{
    const auth = useContext(AuthContext);   //AuthContext can be used in any file - lets us konw if the user is logged in

    return <ul className="nav-links">
        <li>
            <NavLink to="/" exact>All Users</NavLink>
        </li>
        {auth.isLoggedIn && (
            <li>
                <NavLink to={`/${auth.userID}/places`}>My Places</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <NavLink to="/places/new">Add Place</NavLink>
            </li>
        )}
        {!auth.isLoggedIn && (
        <li>
            <NavLink to="/auth">Authenticate</NavLink>
        </li>
        )}
         {auth.isLoggedIn && (
        <li>
            <button onClick = {auth.logout}>Log out </button>
        </li>
        )}

    </ul>
}

export default NavLinks;