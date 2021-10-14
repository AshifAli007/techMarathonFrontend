import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import Question from '../../components/Question/Question';
import styles from './EventExam.module.css';
import Loader from '../../components/Loader/Loader';
import $ from 'jquery';
import CountDownTimer from '../../components/CountDownTimer/CountDownTimer';

class EventExam extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            event: null,
            eventName: null,
            isEventDeleted: false,
            isTimeEnded:false,
            question: null,
            currentQuestion : null,
            optionSelected: null,
            endTime: null,
            loading: true,
        }
    }

    async componentDidMount(){
        await axios.get('/eventService/getEvent/'+this.props.match.params.id,{
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        })
            .then(res=>{
                const event = res.data.data;
                let currentEvent = JSON.parse(localStorage.getItem('userResponses'));
                currentEvent = currentEvent[event.eventCode];

                let currentQuestion = event.questions.filter(question => question.qid === currentEvent.currentQuestion)[0];
                console.log(currentQuestion);
                let currentQuestionResponse = currentEvent.responses[currentEvent.currentQuestion - 1];
                console.log(currentQuestionResponse);
                const newQuestion = <Question nextPrevHandler ={this.onClickNextAndPrevHandler}  
                                                details={currentQuestion} 
                                                event={event.eventCode}
                                                onOptionUpdate = {this.onOptionUpdate}
                                                res = {currentQuestionResponse.userAns} />
                this.setState({event: event, currentQuestion: currentEvent.currentQuestion, question: newQuestion});

            });  
            
            await axios.get('userService/getUsers/',{
                headers:{
                    'Authorization' : `Bearer ${this.props.token}`,
                }
            })
                .then(res=>{
                    console.log("Users Data",res.data.data);
                    const currentUser = JSON.parse(localStorage.getItem('userId'));
                    const user = res.data.data.filter(user=> user._id === currentUser._id)[0];
                    console.log('curr user', user);
                    const eventExist = user.events.filter(event=> this.state.event.eventCode === event.eventCode)[0];
                    let endTime = null;
                    if(eventExist){
                        console.log('event exists');
                        endTime = eventExist.endTime;
                    }else{
                        endTime = new Date();
                        endTime.setMinutes(endTime.getMinutes() + this.state.event.duration);
                        const eventToAdd = {
                            eventCode: this.state.event.eventCode,
                            endTime: endTime,
                        }
                        console.log(eventToAdd);
                        const url = 'userService/updateUser/';
                        axios.put(url,{
                            userDetails:{
                                _id: user._id,
                                eventToAdd: eventToAdd,
                            }
                            
                        },{
                            headers:{
                                'authorization' : `Bearer ${this.props.token}`,
                            }
                        }).then(res=>{
                            console.log(res);
                            this.setState({endTime : endTime});
                            this.setState({loading: false});
                        })
                      
                    }
                    this.setState({endTime : endTime});
                    this.setState({loading: false});
                    const today = new Date();
                    const timeout = Date.parse(endTime) - today.getTime();
                    setTimeout(()=>{
                        this.setState({isTimeEnded: true});
                    }, timeout);

                });
    }
    onOptionUpdate = (selectedOption)=>{
        console.log(selectedOption);
        let prevResponse = JSON.parse(localStorage.getItem('userResponses'));

        let updatedEvent = prevResponse[this.state.event.eventCode];
        let currentQuestion = updatedEvent.responses[updatedEvent.currentQuestion - 1];
        currentQuestion.userAns = selectedOption;
        updatedEvent.responses[updatedEvent.currentQuestion-1] = currentQuestion;
    
        prevResponse[this.state.event.eventCode] = updatedEvent;
        localStorage.setItem('userResponses', JSON.stringify(prevResponse));
    }
    onQuestionChange = (question)=>{
        let prevResponse = JSON.parse(localStorage.getItem('userResponses'));
        

        let updatedEvent = prevResponse[this.state.event.eventCode];
        const newQuestion = <Question nextPrevHandler ={this.onClickNextAndPrevHandler}  
                                        details={question}
                                        event={this.state.event.eventCode}
                                        onOptionUpdate = {this.onOptionUpdate}
                                    />
        updatedEvent.currentQuestion = question.qid;

        prevResponse[this.state.event.eventCode] = updatedEvent;

        localStorage.setItem('userResponses', JSON.stringify(prevResponse));
        console.log(prevResponse);
        this.setState({question: newQuestion, currentQuestion: question.qid});
    }
    onClickNextAndPrevHandler = (action)=>{
        let currentQuestion = this.state.currentQuestion;

        if(action == "prev"){
            if(this.state.currentQuestion !== 1)
                currentQuestion = this.state.currentQuestion - 1;
        }else if(action == "next"){
            if(this.state.currentQuestion !== this.state.event.questions.length)
                currentQuestion = this.state.currentQuestion + 1;
                console.log('from next handler',currentQuestion);
        }
        const question = this.state.event.questions.filter(question => question.qid === currentQuestion)
        console.log(question);
        this.onQuestionChange(question[0]);

    }
    timeToEnd = (endTime) =>{
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
        // if(days <=0 && hours<=0 && minutes<=0 && seconds<=0){
        //     if(!this.state.isLive)
        //         this.setState({isLive: true});
        // }
        return timeToLive;
    }
    onFinalSubmitHandler = ()=>{
        const header = {
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        };
        const eventCode = this.state.event.eventCode;
        const data = {
            "responseDetails" : {
                    "eventCode": eventCode,
                    "user": JSON.parse(localStorage.getItem("userId")),
                    "email":'1@2.com',
                    "phone":'0123456789',
                    "college":'DDUC',
                    "response": JSON.parse(localStorage.getItem("userResponses"))[eventCode].responses,
                    "timeLeft":"24:36",
            }
        }
        axios.post('/quizService/addResponse', data, header)
            .then(res=>{
                if(this.state.isTimeEnded){
                    this.props.history.push('/events');
                }
                $('.myModal').css('display', 'block');
                console.log(res);
            });
    }
    closeModal = () =>{
        $('.myModal').css('display', 'none');
    }
    render() {
        let questionsDiv = null
        if(this.state.event){
           questionsDiv = this.state.event.questions.map((question, index)=>{
                return (
                    <div key={index} onClick={()=>this.onQuestionChange(question)} className={styles.questionBox}>{index + 1}</div>

                )
            });
        }
        return (
            this.state.loading ? <Loader/> :
            (<div>
                {this.state.isTimeEnded? this.onFinalSubmitHandler(): null}
                <CountDownTimer hoursMinSecs={this.timeToEnd(this.state.endTime)}/>
                {questionsDiv}
                {this.state.event ? <div>{this.state.event.name}</div> : <div>no event</div>


                }
                {this.state.question}
                <button className="btn btn-warning" onClick={this.onFinalSubmitHandler}>Final Submit</button>
                {/* ------------------MODAL------------ */}
                <div className={styles.myModal + " myModal"}>
                    <p className="myModal">Are You Sure!</p>
                    <button className="btn btn-info" onClick={this.closeModal}>No</button>
                    <Link to="/events"><button className="btn btn-info">Yes</button></Link>
                </div>
            </div>)
            

        )
    }
}

const mapStateToProps = (state) =>{
    return {
        token: state.auth.token,
    }
}
export default connect(mapStateToProps)(EventExam);