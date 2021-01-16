import { useState, useCallback, useRef, useEffect } from 'react';
//Want to manage loading and error states in here

export const useHttpClient = () => {    //use is standard for naming hooks
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]); //stores data across re-render cycles

    const sendRequest = useCallback( async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();  //used to abort web requests
        activeHttpRequests.current.push(httpAbortController);   //remembers web requests through render cycles
        try{
            const response = await fetch(url, {
                method: method,
                body,
                headers,
                signal: httpAbortController.signal  //used to set up abortcontroller
            })
        
            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController);
            //This keeps every controller except for the controller that was used for this successful request

            if(!response.ok){
                throw new Error(responseData.message);
            }
            setIsLoading(false)
            return responseData;
        } catch(err){
            setError(err.message);
            setIsLoading(false)
            throw err;
        }
    }, []);

    const clearError = () =>{
        setError(null);
    }

    useEffect(() => {   //this will be called once, at the end
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());  //aborts active http requests
        }
    },[]);
    return {isLoading, error, sendRequest, clearError}; //overall component returns this
};