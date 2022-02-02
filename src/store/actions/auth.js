import * as actionTypes from './actionTypes';
import axios from 'axios';
import camelcase from 'camelcase';
import userResponses from '../../assets/userResponse';
import { Redirect } from 'react-router-dom';
import history from './history';
import {message} from 'antd';

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
    localStorage.removeItem('userResponses');
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
    
    const getUserResponses = async (token) => {
        return new Promise((resolve, reject) =>{
            axios.get('/eventService/getEvents',{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then(res=>{
                const events = res.data.data;
                let userResponse = {};
                events.map(event=>{
                    let answers = [];
                    event.questions.map(question=>{
                        let data = {
                            qid: question.qid,
                            userAns: null,
                        }
                        answers.push(data);
                    })
                    let data = {
                        eventName: event.name,
                        eventCode: event.eventCode,
                        currentQuestion: 1,
                        responses: answers,
                    }
                    userResponse[event.eventCode] = data;
                })
                console.log(userResponse);
                resolve(userResponse);
            }).catch(err=>{
                reject(err);
            })
        })

    }
    return dispatch=>{
        dispatch(authStart());
        const authData = {
            userDetails: {
                username: email,
                password: password,
                privileges: 'user'
            }   
        }
        let url = "/userService/login";
        if(isSignUp){
            url = "/userService/sign-up";
        }
        axios.post(url, authData)
            .then( async (response)=>{
                let userResponse = await getUserResponses(response.data.data.accessToken);
                const expirationDate = new Date(new Date().getTime() + response.data.data.expireIn*1000);
                localStorage.setItem('token', response.data.data.accessToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', JSON.stringify(response.data.data.userId));
                localStorage.setItem('userResponses', JSON.stringify(userResponse));
                dispatch(authSuccess(response.data.data.accessToken, response.data.data.userId));
                dispatch(checkAuthTimeout(response.data.data.expireIn));
                message.success(`Successfull logged in as ${response.data.data.userId.name}`)
                history.push('/events');
            })
            .catch(err=>{
                console.log(err);
                message.error('username or email not found');
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