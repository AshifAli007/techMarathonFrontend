import React, { Component } from 'react';
import styles from './EventDetails.module.css';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import CountDownTimer from '../../components/CountDownTimer/CountDownTimer';
import {Button, Tag} from 'antd';
import eventImage from '../../helpers/eventsImages';

class EventDetails extends Component {
    
    state = {
        event: null,
        eventName: null,
        isEventDeleted: false,
        loading: true,
        isLive: false,
        hasRegistered: false,
        hasSubmitted: false,
        hasStarted: false,
        hasEnded: false,
    }
    userId = JSON.parse(localStorage.getItem('userId'))['_id'];
    componentDidMount(){
        let event = {};
        axios.get('/eventService/getEvent/'+this.props.match.params.id,{
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        })
            .then(res=>{
                event = res.data.data;
                this.getEndTime(this.userId, event.eventCode);
                this.setState({event: event});
                axios.get('/quizService/getRequests',{
                    headers: {
                        'Authorization': `Bearer ${this.props.token}`,
                    }
                }).then(res=>{
                    const requests = res.data.data;
                    requests.map(request=>{
                        const user = JSON.stringify(request.user);
                        const localUser = localStorage.getItem('userId');
                        if((request.eventCode === this.state.event.eventCode) && (user===localUser))
                            this.setState({hasRegistered: true});
                    })
                })
                axios.get('/quizService/getResponses',{
                    headers: {
                        'Authorization': `Bearer ${this.props.token}`,
                    }
                }).then(res=>{
                    const responses = res.data.data;
                    responses.map(response=>{
                        const user = JSON.stringify(response.user);
                        const localUser = localStorage.getItem('userId');
                        if((response.eventCode === this.state.event.eventCode) && (user===localUser))
                            this.setState({hasSubmitted: true});
                    })
                    this.setState({loading: false});
                })
            });



        
    }

    deleteEventHandler(props){
        axios.delete('/eventService/deleteEvent/'+this.state.event._id, {
                headers: {
                    'Authorization': `Bearer ${this.props.token}`,
                }
            }).then(data=>{
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
    addStartTime = async() =>{
        
        const d = new Date();
        const currentTime = d.getTime();
        const body={
            eventCode: this.state.event.eventCode,
            userId: this.userId,
            startTime: currentTime
        }
        await axios.post(`/quizService/addStartTime/`,body,
        {
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        }
        );
        if(this.state.event.eventCode === 'bamboozled'){
          
            const body = {
                user: JSON.parse(localStorage.getItem('userId')),
            }
            await axios.post('/bamboozled/addBamboozledUser', body, 
            {
                headers:{
                    'Authorization' : `Bearer ${this.props.token}`,
                }
            }
            );
            this.props.history.push('/bamboozled');
        }else{
            this.props.history.push(`/eventExam/${this.state.event._id}`);
        }
    }
    getEndTime = async(userId, eventCode) =>{
        const {data} = await axios.get(`/quizService/getEndTime/${userId}/${eventCode}`,
        {
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        }
        );
        if(data.data.length){
            
            this.setState({hasStarted: true});
            
            const endTime = data.data[0].endTime;
            if(Date.now() > endTime){
                this.setState({hasEnded: true});
            }
        }
        
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
            }
        }
        axios.post('/quizService/addRequests', data, header)
            .then(res=>{
                console.log(res);
            });

            this.props.history.push('/events');
    }
    render() {
        let heading = (<div></div>);
        const privileges = JSON.parse(localStorage.getItem('userId'))['privileges'];
        if(this.state.event){
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
                    <div className={styles.thumbnail}>
                        
                        <img 
                            alt='eventImage'
                            className={styles.left} 
                            src={eventImage[this.state.event.eventCode.toLowerCase()]}
                        />
                    </div>
                    <div className={styles.right}>
                        <h1>{this.state.event.name}</h1>

                        <div className={styles.seperator}></div>
                        <p>{this.state.event.description}</p>
                    </div>

                   <div style={{
                       position: 'absolute',
                       bottom: '3%',
                       right:'3%'
                   }}>
                    {privileges=== 'admin~' && 
                        <Button 
                            onClick={()=>this.deleteEventHandler(this.props)}
                            danger
                        >Delete
                        </Button>
                    }

                    {this.state.isLive &&
                     this.state.hasSubmitted &&
                        <p className="btn btn-info">We Have Recieved Your Submission</p>
                    }
                    {this.state.isLive &&
                     !this.state.hasStarted &&
                     !this.state.hasSubmitted &&
                        // 

                            <Button
                            onClick={()=>{
                                this.addStartTime();
                                
                                }
                            }
                                primary>Start Event
                            </Button>
                    }
                    {this.state.isLive &&
                     this.state.hasStarted &&
                     !this.state.hasEnded &&
                     !this.state.hasSubmitted &&
                     <>
                        {this.state.event.eventCode === 'bamboozled' ?
                            <Link to={this.state.event && "/bamboozled/"}>
                                <Button primary>Continue event</Button>
                            </Link>
                            :
                            <Link to={this.state.event ? "/eventExam/"+this.state.event._id : ""}>
                                <Button primary>Continue event</Button>
                            </Link>
                        }
                        </>
                    }
                    {
                        !this.state.isLive &&
                        this.state.hasRegistered &&
                        <Button color='lime'  > Already Registered</Button>
                    }
                    {
                        !this.state.isLive &&
                        !this.state.hasRegistered &&
                        <Button onClick={this.onPreRegisterHandler} primary>Pre-Register</Button>
                    }
                    {this.state.isLive &&
                     this.state.hasStarted &&
                     this.state.hasEnded &&
                     !this.state.hasSubmitted &&
                        <Button primary>No Responses, Event Has Ended</Button>
                    }
                   </div>
                   <div  style={{
                       position: 'absolute',
                       bottom: '3%',
                       left:'3%'
                   }}><CountDownTimer hoursMinSecs={this.timeToLive(this.state.event.endTime)}/></div>
                    
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