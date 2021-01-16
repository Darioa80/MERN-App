import React, { useContext } from 'react';
import {useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook'
import './PlaceForm.css';
import { useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Auth from '../../user/pages/Auth';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const NewPlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }
    }, false);
  
    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try{
            await sendRequest('http://localhost:5000/api/places/',
                'POST',
                JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
                address: formState.inputs.address.value,
                creator: auth.userID
            }),
            {'Content-Type': 'application/json'});
            history.push('/');
        }catch(err) {


        }  
        
        console.log(formState.inputs);  //send this to the back end

    }


    return ( 
    <React.Fragment>
    <ErrorModal error={error} onClear = {clearError} />
    <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay/>}
        <Input 
        id = "title"
        element ="input" 
        type="text" 
        label="Title" 
        validators={[VALIDATOR_REQUIRE()]}  //Sends in validators that we want to check
        errorText="Please enter a valid Title."
        onInput={inputHandler}  
        />
        <Input 
        id = "description"
        element ="textarea" 
        label="Description" 
        validators={[VALIDATOR_MINLENGTH(5)]}  //Sends in validators that we want to check
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        />
         <Input 
        id = "address"
        element ="textarea" 
        label="Address" 
        validators={[VALIDATOR_REQUIRE()]}  //Sends in validators that we want to check
        errorText="Please enter a valid address."
        onInput={inputHandler}
        />
        <Button type="submit" disabled = {!formState.isValid}>Add Place</Button>
    </form>
    </React.Fragment>
    );

}

export default NewPlace;