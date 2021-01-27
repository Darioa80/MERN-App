import React, { useEffect, useState } from 'react';
//Can see a list of users and how many places they have shared
//Goal is to output a list of users
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';


const Users = () =>{

    const [loadedUsers, setLoadedUsers] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(()=>{ //useEffect doesn't want async functions, so we put the async request within a non async function
        const fetchUsers = async () => {
           
            try{
                const responseData =  await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/`);        //GET is the default method of Fetch, don't need to specify
                
                    setLoadedUsers(responseData.users); //defines loadedUsers
                
                } catch(err){
                
                }

        };
        fetchUsers();
    },[sendRequest]);   //if the dependency array is blank, it will only run once


    return (
    <React.Fragment>
        <ErrorModal error = {error} onClear = {clearError}/>
        {isLoading && (
            <div className="center">
                <LoadingSpinner />
            </div>)}
        {!isLoading && loadedUsers && <UsersList items = {loadedUsers}/>}
    </React.Fragment>

    );
}

export default Users;