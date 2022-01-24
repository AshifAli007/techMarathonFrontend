import React, { Component } from 'react';
import Event from '../../components/Event/Event';
import styles from  './Events.module.css';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';

class Events extends Component {
    state ={
        events: [],
        loading: true,
    }
    componentDidMount(){
        axios.get('/eventService/getEvents',{
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
            }
        })
                .then(res=>{
                    const events = res.data.data;
                    this.setState({events: events, loading: false});

                });
    }
    timeToLive = (endTime) =>{
        let today = new Date();

        let diffInMilliSecs = Date.parse(endTime) - today.getTime();

        let days = Math.floor(diffInMilliSecs/(1000*60*60*24));
        let hours = Math.floor((diffInMilliSecs/(1000*60*60))%24);
        let minutes = Math.floor((diffInMilliSecs/(1000*60))%60);
        let seconds = Math.floor((diffInMilliSecs/(1000))%60);
        
        let timeToLive = {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds:seconds
        }
        return timeToLive;
    }
    render() {
        let post = <Loader />;
     
        post = this.state.events.map(event=>{

            return <Event 
                    key={event._id} 
                    // id={event._id}
                    // event = {event.name} 
                    // content = {event.description} 
                    timeToLive = {this.timeToLive(event.endTime)}
                    isAuthenticated = {this.props.isAuthenticated}
                    event={event}
                />
    
        });

        
        return (
            <div className={"row justify-content-start "+ styles.row}>
                        {this.state.loading ? <Loader />: (post)}
                </div>
        );
    }
}
const mapStateToProps = (state) =>{
    return{
        token: state.auth.token,
        isAuthenticated: state.auth.token !== null,
    }
}

export default connect(mapStateToProps)(Events);