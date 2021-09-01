import React, { Component } from 'react';
import styles from './EventDetails.module.css';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import CountDownTimer from '../../components/CountDownTimer/CountDownTimer';

class EventDetails extends Component {
    state = {
        event: null,
        eventName: null,
        isEventDeleted: false,
        loading: true,
        isLive: false,
    }
    componentDidMount(){
        axios.get('/eventService/getEvent/'+this.props.match.params.id,{
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        })
            .then(res=>{
                const event = res.data.data;
                console.log(event);
                this.setState({event: event, loading:false});
            });
    }

    deleteEventHandler(props){
        console.log('event Deleted'); 
        axios.delete('/eventService/deleteEvent/'+this.state.event._id)
            .then(data=>{
                this.setState({isEventDeleted: !this.state.isEventDeleted});
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
        if(days <=0 && hours<=0 && minutes<=0 && seconds<=0){
            if(!this.state.isLive)
                this.setState({isLive: true});
        }
        return timeToLive;
    }

    onPreRegisterHandler = ()=>{
        const header = {
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        };
        const eventCode = this.state.event.eventCode;
        const data = {
            "requestDetails" : {
                    "eventCode": eventCode,
                    "user": JSON.parse(localStorage.getItem("userId")),
                    "email":'1@2.com',
                    "phone":'0123456789',
                    "college":'DDUC',
            }
        }
        axios.post('/quizService/addRequests', data, header)
            .then(res=>{
                console.log(res);
            });
    }
    render() {
        let heading = (<div></div>);
        
        console.log(this.props.match.params.id);
        if(this.state.event){
            console.log(this.state.event)
            const eventName = this.state.event.name;
            let words = eventName.split(' ');
            heading = (
                <div className={styles.fond}> 
                    <span className={styles.s1}>{words[0]}</span>
                    <span className={styles.s2}>{words[1]?words[1]:''}</span>
                </div>
            );
        }

        
        return(
            this.state.loading ?
                <Loader /> : 

                (<div className={styles.EventDetails}>

                    {this.state.isEventDeleted ? <Redirect to="/events"/> : null}
                    {heading}
                    
                    <div className={styles.card}>
                    <div className={styles.thumbnail}><img className={styles.left} src="https://cdn2.hubspot.net/hubfs/322787/Mychefcom/images/BLOG/Header-Blog/photo-culinaire-pexels.jpg"/></div>
                    <div className={styles.right}>
                        <h1>Why you Need More Magnesium in Your Daily Diet</h1>
                        <div className={styles.author}><img src="https://randomuser.me/api/portraits/men/95.jpg"/>
                        <h2>Igor MARTY</h2>
                        </div>
                        <div className={styles.seperator}></div>
                        <p>Magnesium is one of the six essential macro-minerals that is required by the body for energy production and synthesis of protein and enzymes. It contributes to the development of bones and most importantly it is responsible for synthesis of your DNA and RNA. A new report that has appeared in theBritish Journal of Cancer, gives you another reason to add more magnesium to your diet...</p>
                    </div>
                        <h5>12</h5>
                        <h6>JANUARY</h6>
                    <ul>
                        <li><i className="fa fa-eye fa-2x"></i></li>
                        <li><i className="fa fa-heart-o fa-2x"></i></li>
                        <li><i className="fa fa-envelope-o fa-2x"></i></li>
                        <li><i className="fa fa-share-alt fa-2x"></i></li>
                    </ul>
                    <div className={styles.fab}><i className="fa fa-arrow-down fa-3x"> </i></div>
                    <button onClick={()=>this.deleteEventHandler(this.props)} className="btn btn-warning">Delete</button>
                    {   this.state.isLive?
                        <Link to={this.state.event ? "/eventExam/"+this.state.event._id : ""}>
                            <button
                                    className="btn btn-success">Start Event
                            </button>
                        </Link>:
                        <button onClick={this.onPreRegisterHandler} className="btn btn-info">Pre-Register</button>
                    }
                    <CountDownTimer hoursMinSecs={this.timeToLive( this.state.event.endTime)}/>

                    </div>
                    <div>
                    </div>
                    
                </div>)
                
            
            
        );
    }

}

const mapStateToProps = (state) =>{
    return{
        token: state.auth.token,
    }
}

export default connect(mapStateToProps)(EventDetails);