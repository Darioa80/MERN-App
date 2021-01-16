import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./user/pages/Auth";
import { AuthContext } from './shared/context/auth-context';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState();

  const login = useCallback((uid)=>{
    setIsLoggedIn(true);
    setUserID(uid);
  }, []);

  const logout = useCallback(()=>{
    setIsLoggedIn(false);
    setUserID(null);
  }, []);

  let routes;
  if(isLoggedIn){
    routes = (
      <Switch>
      <Route path="/" exact>   
        <Users />
      </Route>
      <Route path="/:userId/places" exact>   
        <UserPlaces />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/places/:placeId" exact>
        <UpdatePlace />
      </Route>
     <Redirect to="/" />
    </Switch>
    );
  }
  else{
    routes = (
      <React.Fragment>
      <Route path="/" exact>   
        <Users />
      </Route>
      <Route path="/:userId/places" exact>   
        <UserPlaces />
      </Route>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Redirect to="/auth"/> 
    </React.Fragment>
    );
  }

  return (
  <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userID: userID, login: login, logout: logout }}>  
  <Router>
    <MainNavigation />
    <main>
   
      {routes};
   
    </main>
  </Router>
  </AuthContext.Provider>
  );
}

export default App;
