import React, { useState, useContext } from 'react'

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext} from '../../shared/context/auth-context';
import './Auth.css';



const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true);

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

    const authSubmitHandler = event =>{
        event.preventDefault();
        console.log(formState.inputs);
        auth.login();   //updates global state

    }

    return ( <Card className="authentication">
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
    )
}

export default Auth;