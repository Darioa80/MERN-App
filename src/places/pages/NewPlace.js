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
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


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
        }, 
        image: {
            value: null,
            isValid: false
        }
    }, false);
  
    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try{
            const formData = new FormData();    //allows us to send both written and binary data 
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places/',
                'POST',
                formData,
                {
                    Authorization : 'Bearer ' + auth.token
                });
            console.log(formData);
            history.push('/');
        }catch(err) {


        }  
        
          //send this to the back end

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
        <ImageUpload 
        id="image" 
        onInput={inputHandler} 
        errorText="please provide an image."
        />
        <Button type="submit" disabled = {!formState.isValid}>
            Add Place
        </Button>
    </form>
    </React.Fragment>
    );

}

export default NewPlace;