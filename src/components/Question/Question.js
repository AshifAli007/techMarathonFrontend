import React, { Component } from 'react';
import styles from './Question.module.css';
import Options from './Options/Options';

class Question extends Component {
    state = {
        forceReRender : true,
    }
    forceReRender = ()=>{
        this.setState(state=>{
            return {forceReRender: !state.forceReRender};
        })
    }
    onValueChange = (val, event)=>{
        if(val){
            console.log('null send');
            this.props.onOptionUpdate(null);
        }else{
            this.props.onOptionUpdate(event.target.value);
        }
        this.forceReRender();
    }
    render(){
        let userResponses = JSON.parse(localStorage.getItem('userResponses'));
        let currentEvent = userResponses[this.props.event];
        let currentQuestion = currentEvent.responses[this.props.details.qid - 1];
        let userAns = currentQuestion.userAns;
        console.log(userAns);

        const options = this.props.details.options.map((option, index)=>{
        let checked = option.key === userAns;
        return (
            <Options option={option}
                     event={this.props.event}
                     details={this.props.details}
                     onValueChange={this.onValueChange}
                     checked={checked}
            />
        )
    });
    return(
        
    <div className={styles.container}>
        
        <div className={styles.ques}>{this.props.details.text}</div>
        
        <ul style={{padding:'0', marginTop:'3%'}}>
            {options}
        </ul>
        <button 
            onClick={() => this.props.nextPrevHandler("prev")} 
            className="btn btn-success"
            style={{
                position: "absolute",
                bottom: '3%',
                left: '3%'
            }}
        >Previous
        </button>
        <div>
        <button 
            onClick={() => this.props.nextPrevHandler("next")} 
            className="btn btn-success"
            style={{
                position: 'absolute',
                bottom: '3%',
                right: '3%',
            }}
        >Next
        </button>
        </div>
        
    </div>
    )  
    }
}

export default Question;