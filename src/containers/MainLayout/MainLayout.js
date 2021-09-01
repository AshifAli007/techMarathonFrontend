import React, { Component } from 'react';
import {Route, Link, Switch, Redirect} from 'react-router-dom';
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

class Main extends Component {
    render() {
        let routes = (
            <Switch>
                <Route path="/events" exact component={Events}/>
                <Route path="/authentication" component={Auth}/>
                {/* <Redirect to="/events"/> */}
            </Switch>
        )
        if(this.props.isAuthenticated){
            routes = (
                <Switch>
                    <Route path="/events" exact component={Events}/>
                    <Route path="/event/:id" component={EventDetails}/>
                    <Route path="/eventExam/:id" component={EventExam}/>
                    <Route path="/addEvent" component={AddEvent}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/responses" component={Responses}/>
                    <Route path="/requests" component={Requests}/>
                    {/* <Redirect to="/events"/> */}
                </Switch>
            )
        }
        return (
            <div>
                <Navbar/>
                    {routes}

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