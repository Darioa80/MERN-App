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
            console.log(userID);
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userID}`);
            setLoadedPlaces(responseData.places);
            console.log(loadedPlaces); 
        } catch(err){

        }
    };
    fetchPlaces();
    },[sendRequest, userID]);

   const placeDeleteHandler = deletedPlaceId =>{
     
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));

   }
    
    return (
    <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && ( 
        <div className ="center">
            <LoadingSpinner />
        </div>
        )}
        {!isLoading && loadedPlaces && <PlaceList items = {loadedPlaces} onDeletePlace = {placeDeleteHandler}/>}
    </React.Fragment>
        )
};

export default UserPlaces;