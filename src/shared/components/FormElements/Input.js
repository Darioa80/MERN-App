import React, { useReducer, useEffect } from 'react';
//You can use third party libraries to handle input forms

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {   //receives an action, and updates the state based on the action
    console.log(action);
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state, //copies old state object into new state object
                value: action.val,
                isValid: validate(action.val, action.validators) //this is true (debug)
            };
        case 'TOUCH':
            return{
                ...state,
                isTouched: true
            };
        default:
            return state;

    }

}


const Input = props => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '', 
        isTouched: false, 
        isValid: props.initialValid || false
    });   //second argument is an initial state                                                      
   
    const {id, onInput} = props;
    const {value, isValid} = inputState;

        
    useEffect(() => {
        props.onInput(id, value, isValid)   //function weill be defined in NewPlace.js

    }, [id, value, isValid, onInput]); //these are the dependencies, if these change the function is called

    const changedHandler = event => {//calls the useReducer and updates inputState
        dispatch({
        type: 'CHANGE', 
        val: event.target.value,        //event target value is the input of the user
        validators: props.validators}); 
    };  

    const touchHandler =() =>{
        dispatch({
            type: "TOUCH"
        });
    }

    //below is the display JSX
    let element; 
    if(props.element === 'input'){
        element = <input id={props.id} 
        type={props.type} 
        placeholder={props.placeholder} 
        onChange={changedHandler}
        onBlur={touchHandler}
        value={inputState.value} 
        />;
    }
    else {
        element = <
            textarea id={props.id} 
        rows={props.rows || 3} 
        onChange={changedHandler} 
        onBlur ={touchHandler}
        value={inputState.value}
        />;
    }



    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && `form-control--invalid`}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
}

export default Input