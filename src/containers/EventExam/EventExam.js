import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Question from '../../components/Question/Question';
import styles from './EventExam.module.css';
import camelcase from 'camelcase';

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
        }
    }

    componentDidMount(){
        axios.get('/eventService/getEvent/'+this.props.match.params.id,{
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
            <div>

                {questionsDiv}
                {this.state.event ? <div>{this.state.event.name}</div> : <div>no event</div>


                }
                {this.state.question}
            </div>
            

        )
    }
}

const mapStateToProps = (state) =>{
    return {
        token: state.auth.token,
    }
}
export default connect(mapStateToProps)(EventExam);