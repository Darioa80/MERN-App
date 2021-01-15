import React, { useEffect, useState } from 'react';
//Can see a list of users and how many places they have shared
//Goal is to output a list of users
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';



const Users = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(()=>{ //useEffect doesn't want async functions, so we put the async request within a non async function
        const sendRequest = async () => {
            setIsLoading(true);
            try{
                const response =  await fetch('http://localhost:5000/api/users/');        //GET is the default method of Fetch, don't need to specify
                const responseData = await response.json();
                
                if(!response.ok){
                    throw new Error(responseData.message);
                }
                setLoadedUsers(responseData.users); //defines loadedUsers
                
                } catch(err){
                
                    setError(err.message);
                }
                setIsLoading(false);
        };
        sendRequest();
    },[])   //if the dependency array is blank, it will only run once

    const errorHandler = () =>{
        setError(null);
    }

    return (
    <React.Fragment>
        <ErrorModal error = {error} onClear = {errorHandler}/>
        {isLoading && (
            <div className="center">
                <LoadingSpinner />
            </div>)}
        {!isLoading && loadedUsers && <UsersList items = {loadedUsers}/>}
    </React.Fragment>

    );
}

export default Users;