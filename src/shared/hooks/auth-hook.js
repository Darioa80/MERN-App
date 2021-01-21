import { useState, useCallback, useEffect } from 'react'

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userID, setUserID] = useState();
  
   
  
    const login = useCallback((uid, token, expirationDate)=>{
      setToken(token);
      setUserID(uid);
      const tokenExpirationDate =
        expirationDate || new Date(Date.now() + 1000*60*60);
        
      setTokenExpirationDate(tokenExpirationDate);

      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString()
        })
      );
    }, []);
  
    const logout = useCallback(()=>{
      setToken(null);
      setTokenExpirationDate(null);
      setUserID(null);
      console.log('we about to log out');
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if(token && tokenExpirationDate){
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        console.log(remainingTime);
        logoutTimer =  setTimeout(logout, remainingTime); 
      }
      else {
        clearTimeout(logoutTimer); //clears the timer in case we log out manually
      }
  
    }, [token, logout, tokenExpirationDate])
  
  
    useEffect(()=>{ //will run once after the render cycle and allows the user to stay logged in
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if(
        storedData && 
        storedData.token && 
        new Date(storedData.expiration) > new Date()) //compares expiration date to current time
          {
        login(storedData.userID, storedData.token, new Date(storedData.expiration));
          }
    },[login]);

    return {token, login, logout, userID}
};