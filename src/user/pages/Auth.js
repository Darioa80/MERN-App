import React, { useState, useContext } from 'react'

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext} from '../../shared/context/auth-context';
import './Auth.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

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
                name: undefined
            },
             formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            },false)
        }
        setIsLoginMode(prevMode => !prevMode); //prevMode 
    }

    const authSubmitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        if(isLoginMode){    //this state determines the form we show the user
            try {
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                    
                });
                const responseData = await response.json();
                if (!response.ok){
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                auth.login();
            } catch(err){
                setIsLoading(false);
                setError(err.message || 'Something went wrong, please try again.');
            }
           
        } else {
            try {
             //update state  to refresh UI  
            const response = await fetch('http://localhost:5000/api/users/signup', {    //response has all response data but doesn't have a parsed response body
            method: 'POST',             //fetch doesn't consider 400 or 500 response codes as an error
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
            })
        });
        const responseData = await response.json();
        if (!response.ok){   //will be true if we have a 200 status code 
            throw new Error(responseData.message);  //will lead to catch block
        }
        console.log(responseData);
        setIsLoading(false);
        auth.login();  
        } catch(err){
            
            setIsLoading(false);
            setError(err.message || 'Something went wrong, please try again.');
        }
    }
        
        //fetch('http://localhost:5000/api/users/login');
        //console.log(formState.inputs);
         //updates global state

    }

    const errorHandler = () => {
        setError(null);

    }

    return ( 
    <React.Fragment>
    <ErrorModal error = {error} onClear = {errorHandler}/> 
    <Card className="authentication">
    {isLoading && <LoadingSpinner asOverlay/>}
    <h2>Log In Required</h2>
    <form className="place-form" onSubmit={authSubmitHandler}>
    {!isLoginMode && <Input 
        element="input" 
        id="name" 
        type="text" 
        label = "Your Name" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText = "Please esnter a name."
        onInput={inputHandler}/>
    }
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
    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}  //Sends in validators that we want to check
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