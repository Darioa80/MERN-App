import React from 'react';
import { useParams } from 'react-router-dom';

//Want to return a list of places
import PlaceList from '../components/PlaceList';


const DUMMY_PLACES = [
    {
        id: 'p1',
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world.",
        imageURL: "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
        address: "20 W 34th St, New York, NY 10001",
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        }, 
        creator: 'u1'
    },
    {
        id: 'p2',
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world.",
        imageURL: "https://www.empirestaterealtytrust.com/wp-content/uploads/images/empire-state-building2-241x300.jpg",
        address: "20 W 34th St, New York, NY 10001",
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        }, 
        creator: 'u2'
    }
];

const UserPlaces = () => {
    const userId = useParams().userId;  //comes from app.js " <Route path="/:userId/places" exact> "
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return <PlaceList items = {loadedPlaces}/>
};

export default UserPlaces;