import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//Want to return a list of places
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const UserPlaces = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();

    const userID = useParams().userId;  //comes from app.js " <Route path="/:userId/places" exact> "
    //let's retrieve the data from the db here

    
useEffect(() =>{ 
    const fetchPlaces = async () =>{
        try {
            const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userID}`);
            setLoadedPlaces(responseData.places);
        } catch(err){

        }
    };
    fetchPlaces();
    },[sendRequest, userID]);

   
    
    return (
    <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && ( 
        <div className ="center">
            <LoadingSpinner />
        </div>
        )}
        {!isLoading && loadedPlaces && <PlaceList items = {loadedPlaces}/>}
    </React.Fragment>
        )
};

export default UserPlaces;