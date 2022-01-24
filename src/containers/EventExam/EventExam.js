import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import Question from '../../components/Question/Question';
import styles from './EventExam.module.css';
import Loader from '../../components/Loader/Loader';
import $ from 'jquery';
import Countdown from 'react-countdown';
import { message } from 'antd';

const userId = JSON.parse(localStorage.getItem('userId'))['_id'];

class EventExam extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            event: null,
            eventName: null,
            isEventDeleted: false,
            question: null,
            currentQuestion : null,
            optionSelected: null,
            loading: true,
            endTime:"",
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    componentDidMount(){
        axios.get('/eventService/getEvent/'+this.props.match.params.id,{
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        })
            .then(res=>{
                const event = res.data.data;
                this.getEndTime(userId, event.eventCode).then((endTime)=>{
                    if(Date.now() > endTime){
                        console.log('time over');
                    }else{
                        console.log(endTime - Date.now());
                        this.timer = setTimeout(()=>{
                            this.onFinalSubmitHandler();
                            
                        },endTime - Date.now());
                    }
                    
                });
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
                this.setState({event: event, currentQuestion: currentEvent.currentQuestion, question: newQuestion, loading: false});
            });            
    }
    getEndTime = async(userId, eventCode) =>{
        const {data} = await axios.get(`/quizService/getEndTime/${userId}/${eventCode}`,
        {
            headers:{
                'Authorization' : `Bearer ${this.props.token}`,
            }
        }
        );
        const endTime = data.data[0].endTime;
        if(data.data.length){
            this.setState({endTime: endTime});
            return endTime;
        }
        
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
    onFinalSubmitHandler = async()=>{
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
        await axios.post('/quizService/addResponse', data, header)
            .then(res=>{
                $('.myModal').css('display', 'block');
                message.success('Responses submitted successfully');
                this.props.history.push('/events');
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
            <>
             {this.state.event ?
                <div className={styles.eventName}>
                    {this.state.event.name}
                    {console.log(Date.now() + 10000-parseInt(this.state.endTime))}
                    {/* <Countdown date={Date.now()+ 10000}/> */}
                    {this.state.endTime && <Countdown date={parseInt(this.state.endTime)}/>}
                    
                </div> 
                :<div>no event</div>}
            <div className={styles.container}>
           
                <div className={styles.allQuestions}>
                    {questionsDiv}
                </div>
                
                <div className={styles.currentQuestion}>
                {this.state.question}
                <button className="btn btn-info" onClick={this.onFinalSubmitHandler}>Final Submit</button>
                </div>
               
            </div>
            {/* ------------------MODAL------------ */}
            <div className={styles.myModal + " myModal"}>
                <p className="myModal">Are You Sure!</p>
                <button className="btn btn-info" onClick={this.closeModal}>No</button>
                <Link to="/events"><button className="btn btn-info">Yes</button></Link>
            </div>
            </>
            

        )
    }
}

const mapStateToProps = (state) =>{
    return {
        token: state.auth.token,
    }
}
export default connect(mapStateToProps)(EventExam);