import React, { Component } from 'react';
import {Route, Link, Switch, Redirect , BrowserRouter} from 'react-router-dom';
import Events from '../Events/Events';
import EventDetails from '../EventDetails/EventDetails';
import EventExam from '../EventExam/EventExam';
import AddEvent from '../AddEvent/AddEvent';
import Auth from '../Auth/Auth';
import { connect } from 'react-redux';
import Logout from '../Auth/logout/logout';
import Navbar from '../../components/Navbar/Navbar';
import Responses from '../Responses/Responses';
import Requests from '../Requests/Requests';
import Results from '../Results/Results';
import '../../App.css';
import Bamboozled from '../Bamboozled/Bamboozled';
import BamboozledAdmin from '../BamboozledAdmin/BamboozledAdmin'
import './MainLayout.css';


class Main extends Component {
    render() {
        let routes = (
            <Switch>
                <Route path="/events" exact component={Events}/>
                <Route path="/authentication" component={Auth}/>
                <Route path="/" exact component={Events}/>
    
            </Switch>
        )
        if(this.props.isAuthenticated){
            const privileges = JSON.parse(localStorage.getItem('userId'))['privileges'];
            if(privileges === 'user'){
                routes = (
                    <Switch>
                        <Route path="/events" exact component={Events}/>
                        <Route path="/event/:id" component={EventDetails}/>
                        <Route path="/eventExam/:id" component={EventExam}/>
                        <Route path="/logout" component={Logout}/>
                        <Route path="/results" component={Results}/>
                        <Route path="/bamboozled" component={Bamboozled}/>
                        <Route path="/" exact component={Events}/>
                        
                    </Switch>
                )
            }else if(privileges === 'admin~'){
                routes = (
                    <Switch>
                        <Route path="/events" exact component={Events}/>
                        <Route path="/event/:id" component={EventDetails}/>
                        <Route path="/eventExam/:id" component={EventExam}/>
                        <Route path="/addEvent" component={AddEvent}/>
                        <Route path="/logout" component={Logout}/>
                        <Route path="/responses" component={Responses}/>
                        <Route path="/requests" component={Requests}/>
                        <Route path="/results" component={Results}/>
                        <Route path="/bamboozled/admin" component={BamboozledAdmin}/>
                        <Route path="/bamboozled" component={Bamboozled}/>
                        
                        <Route path="/" exact component={Events}/>
                    </Switch>
                )
            }
            
        }
        return (
            <div>
                <Navbar/>

                {routes}
                <div  className='footer'>Made By Mohd Ashif</div>
            </div>
                        
        );
    }
}
const mapStateToProps = (state) =>{
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Main);