import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UpdatePlace = () => {
    const [isLoading, error, sendRequest, clearError] = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeID = useParams().placeId;    //named in App.js

    
    const [formState, inputHandler, setFormData] = useForm(
        {
        title: {
            value: '',
            isValid: false
        }, 
        description : {
            value: '',
            isValid: false
        }

    }, 
    false
    );

    useEffect(()=>{
        
        const fetchPlace = async () =>{
            try{
                const responseData = await sendRequest(`http://localhost:5000/api/places/${placeiD}`);
                setLoadedPlace(responseData.place);
                setFormData(
                    {        
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    }, 
                    description : {
                        value: responseData.place.description,
                        isValid: false
                    }
                }, 
                    true
                    );
            }       
            catch(err){

            }
    };
    fetchPlace();
    },[sendRequest, placeId, setFormData]);    //will come from back end (won't be available instantly)




    const placeUpdateSubmitHandler = event =>{
        event.preventDefault();
        
        console.log(formState.inputs);


    }

    if(isLoading){
        return(
            <div className='center'>
                <LoadingSpinner />
            </div>
        )
    }

    if(!loadedPlace && !error){
        return (
        <div className="center">
            <Card>
                <h2>Could not find place!</h2>
            </Card>
        </div>
        )
    }


    return (
    <React.Fragment>
    <ErrorModal error = {error} onClear = {clearError} />
    {!isLoading && loadedPlace &&<form className="place-form" onSubmit = {placeUpdateSubmitHandler}>
        <Input 
        id="title" 
        element = "input"
        type="text" 
        label="Title" 
        validators = {[VALIDATOR_REQUIRE()]}
        errorText = "Please enter a valid title."
        onInput = {inputHandler}
        initialValue = {loadedPlace.title}
        initialValid = {true}
        />
     <Input 
        id="description" 
        element = "textarea" 
        label="Decription" 
        validators = {[VALIDATOR_MINLENGTH(5)]}
        errorText = "Please enter a valid description (min. 5 character)."
        onInput = {inputHandler}
        initialValue = {loadedPlace.description}
        initialValid = {true}
        />
        <Button type="submit" disabled= {!formState.isValid}> Update Place</Button>

    </form>}
    </React.Fragment>
    );
}

export default UpdatePlace;