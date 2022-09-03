import React from 'react';
import {Redirect, Route} from 'react-router-dom';

const ProtectedRoute = ({component: Component, ...props}) => {
    return (
        <Route>
            {() =>
                props.loggedIn ? <Component {...props} /> : <Redirect to="./sign-up"/>
            }
        </Route>
    )
};

export default ProtectedRoute;