import React, { useRef, useState, useEffect } from 'react'

import './ImageUpload.css';

import Button from './Button';

const ImageUpload = props =>{
const filePickerRef = useRef(); //used because we want to access data that will exists regardless of rendering cycles
const [file, setFile] = useState();
const [previewUrl, setPreviewUrl] = useState();
const [isValid, setIsValid] = useState(false);

useEffect(()=>{ //generate a preview and will be called on file change
    if(!file){
        return;
    }
    else {
        const fileReader = new FileReader();        //in the browser
        fileReader.onload = () => { //will be called once the file reader loads a new file
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }

}, [file])

const pickedHandler = event => {    //when user picks an image
    console.log(event.target);
    let pickedFile;
    let fileIsValid = isValid;
    if(event.target.files || event.target.files.length === 1){
        pickedFile = event.target.files[0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;

    } else {
        setIsValid(false);
        fileIsValid = false;
    }

    console.log(pickedFile);

    props.onInput(props.id, pickedFile, fileIsValid)
}

const pickImageHandler = () => {    //will be clicked to then select an image
    filePickerRef.current.click();
}
return (
<div className="form-control">
    <input 
    id={props.id} 
    ref={filePickerRef}
    style={{display: 'none'}} 
    type="file" 
    accept=".jpb, .png, .jpeg"
    onChange = {pickedHandler}
    /> 
        <div className = {`image-upload ${props.center && 'center'}`}>
            <div className="image-upload__preview">
               {previewUrl && <img src ={previewUrl} alt="Preview" />}
               {!previewUrl && <p>Please pick an image.</p>}
            </div>
            <Button type="button" onClick={pickImageHandler}>Pick Image</Button>
        </div>   
       {!isValid && <p>{props.errorText}</p>} 
</div>
);

}

export default ImageUpload;