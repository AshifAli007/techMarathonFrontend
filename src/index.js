import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import authReducer from './store/reducers/auth';
// import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';
import '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import 'antd/dist/antd.css';
import thunk from 'redux-thunk';
import axios from 'axios';
import './App.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
  auth: authReducer
});
// axios.defaults.baseURL = 'http://localhost:8000/v1/';
console.log(process.env.NODE_ENV, 'node env');
if(process.env.NODE_ENV === 'production'){
  axios.defaults.baseURL = "https://techmarathon2022.azurewebsites.net/v1/";
}else{
  axios.defaults.baseURL = "http://localhost:8000/v1/";
}
console.log(process.env.REACT_APP_BASE_URL, process.env.REACT_APP_CLOUD_SERVER, process.env)
const store = createStore(rootReducer,  composeEnhancers(
  applyMiddleware(thunk)
));
const app = (
  <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root')
);


