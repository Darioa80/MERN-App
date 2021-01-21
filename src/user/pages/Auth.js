import React, { useState, useContext } from 'react'

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext} from '../../shared/context/auth-context';
import './Auth.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () =>{
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },
             formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            },false)
        }
        setIsLoginMode(prevMode => !prevMode); //prevMode 
    }

    const authSubmitHandler = async event => {  //due to the image used in sign up, we can't only send JSON data
        event.preventDefault();
        console.log(isLoginMode);
        if(isLoginMode){    //this state determines the form we show the user
            try{
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                      email: formState.inputs.email.value,
                      password: formState.inputs.password.value
                    }),
                    {
                      'Content-Type': 'application/json'
                    }
                  );
                  console.log('Login');
                  auth.login(responseData.userId, responseData.token);
            } catch(err) {

            }
        } else {
            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                  'http://localhost:5000/api/users/signup',
                  'POST',
                  formData
                );
                console.log(responseData);
                auth.login(responseData.userId, responseData.token);
        } catch(err){

        }
    }
        
        //fetch('http://localhost:5000/api/users/login');
        //console.log(formState.inputs);
         //updates global state

    }


    return ( 
    <React.Fragment>
    <ErrorModal error = {error} onClear = {clearError}/> 
    <Card className="authentication">
    {isLoading && <LoadingSpinner asOverlay/>}
    <h2>Log In Required</h2>
    <form className="place-form" onSubmit={authSubmitHandler}>
    {!isLoginMode && (
        <Input 
        element="input" 
        id="name" 
        type="text" 
        label = "Your Name" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText = "Please esnter a name."
        onInput={inputHandler}/>)
    }
    {!isLoginMode && <ImageUpload center id = "image" onInput = {inputHandler} errorText="Please upload an image."/>}
    <Input 
    id = "email"
    element ="input" 
    type="email" 
    label="Email" 
    validators={[VALIDATOR_EMAIL()]}  //Sends in validators that we want to check
    errorText="Please enter a valid email address"
    onInput={inputHandler}
    />
    <Input 
    id = "password"
    element ="input" 
    type="password" 
    label="Password" 
    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}  //Sends in validators that we want to check
    errorText="Please enter a valid password"
    onInput={inputHandler}
    />
    <Button type="submit" disabled={!formState.isValid} >
        {isLoginMode ? 'Log in' : 'Sign up'} 
    </Button>
    </form>
    <Button inverse onClick = {switchModeHandler}>
        Switch to {isLoginMode ? 'Sign up' : 'Log in'}
    </Button>


    </Card>
    </React.Fragment>
    )
}

export default Auth;