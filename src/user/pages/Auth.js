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
       
        if(isLoginMode){    //this state determines the form we show the user
            try{
              const responseData = await sendRequest('http://localhost:5000/api/users/login', 'POST', JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                 {
                    'Content-Type': 'application/json',
                });

                auth.login(responseData.user.id); 
            } catch(err) {

            }
        } else {
            try {
             //update state  to refresh UI  
             const responseData =  await sendRequest('http://localhost:5000/api/users/signup',     //response has all response data but doesn't have a parsed response body
            'POST',             //fetch doesn't consider 400 or 500 response codes as an error
            JSON.stringify({
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
            }),
            {
                'Content-Type': 'application/json',
            }
        
        );
        auth.login(responseData.user.id);  
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