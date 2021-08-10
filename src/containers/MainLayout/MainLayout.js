import React, { Component } from 'react';
import {Route, Link, Switch, Redirect} from 'react-router-dom';
import Events from '../Events/Events';
import EventDetails from '../EventDetails/EventDetails';
import AddEvent from '../AddEvent/AddEvent';
import Auth from '../Auth/Auth';
import { connect } from 'react-redux';
import Logout from '../Auth/logout/logout';

class Main extends Component {
    render() {
        let routes = (
            <Switch>
                <Route path="/events" exact component={Events}/>
                <Route path="/authentication" component={Auth}/>
                <Redirect to="/events"/>
            </Switch>
        )
        if(this.props.isAuthenticated){
            routes = (
                <Switch>
                    <Route path="/events" exact component={Events}/>
                    <Route path="/event/:id" component={EventDetails}/>
                    <Route path="/addEvent" component={AddEvent}/>
                    <Route path="/logout" component={Logout}/>
                    <Redirect to="/events"/>
                </Switch>
            )
        }
        return (
            <div>
                <Link to="/events">Events</Link>
                {this.props.isAuthenticated ? <Link to="/addEvent">Add Event</Link> : null}
                { this.props.isAuthenticated 
                    ?<Link to="/logout">Logout</Link>
                    : <Link to="/authentication">Login</Link> }
                
                <i className="fa fa-twitter"></i>
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