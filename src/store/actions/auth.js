import * as actionTypes from './actionTypes';
import axios from 'axios';
export const authStart = () =>{
    return{
        type: actionTypes.AUTH_START,
    }
}

export const authSuccess = (token, userId) =>{
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
    }
}

export const authFail = (authData) =>{
    return{
        type: actionTypes.AUTH_FAIL,
        authData: authData,
    }
}
export const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTime) => {
    console.log(expirationTime);
    return dispatch =>{
        setTimeout(()=>{
            dispatch(logout());
        }, expirationTime * 1000);
    };
}

export const auth = (email, password, isSignUp) =>{
    return dispatch=>{
        dispatch(authStart());
        const authData = {
            userDetails: {
                username: email,
                password: password,
                privileges: 'user'
            }   
        }
        let url = "http://localhost:8000/v1/userService/login";
        if(isSignUp){
            url = "http://localhost:8000/v1/userService/sign-up";
        }
        axios.post(url, authData)
            .then(response=>{
                const expirationDate = new Date(new Date().getTime() + response.data.data.expireIn*1000);
                localStorage.setItem('token', response.data.data.accessToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.data.userId);
                dispatch(authSuccess(response.data.data.accessToken, response.data.data.userId));
                dispatch(checkAuthTimeout(response.data.data.expireIn));
            })
            .catch(err=>{
                console.log(err);
                dispatch(authFail(err));
            })
        
    }
}

export const authCheckState = () =>{
    
    return dispatch => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(!token) {
            console.log("token not valid");
            dispatch(logout());
        } else {
            console.log("token valid");
            const expirationDate =new Date(localStorage.getItem('expirationDate'));
            console.log(expirationDate.getTime(), new Date().getTime());
            if(expirationDate.getTime() > new Date().getTime()) {
                console.log('token still valid');
                dispatch(authSuccess(token, userId));
                console.log("---------------------"+(expirationDate.getTime() - new Date().getTime())/1000);
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            } else {
                console.log('not vailid time over');
                dispatch(logout());
            }
        }
    }
}