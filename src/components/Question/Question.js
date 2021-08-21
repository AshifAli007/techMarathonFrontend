import React, { Component } from 'react';
import styles from './Question.module.css';

class Question extends Component {
    state = {
        index: this.props.res,
        active: true
    }
    componentDidMount() {
        // let res = this.props.res == option.key ? true : false;

        this.setState({index: this.props.res});
    }
    toogleActiveClass = (index)=>{
        if(this.state.index === index){
            this.setState(state=>{
                return {active: !state.active, index: null}
            })
            this.props.onOptionUpdate(null);
        }else{
            this.setState(state=>{
                return {active:true, index: index}
            });
            this.props.onOptionUpdate(index);
        }
    }
    resetState = ()=>{
        
        this.setState({index:this.props.res, active:true});

    }
    render(){ 
    const options = this.props.details.options.map((option, index)=>{
        let res = this.props.res == option.key ? true : false;
        // if(this.state.index == null){

        // }
        {var optionWithClass = res ?
            <li key={option.key}
                className={(this.state.active &&(this.state.index == option.key)) ? styles.active :''}>
                <input onClick={()=>this.toogleActiveClass(option.key)} type="radio" id={option.key} name={this.props.details.qid}/>
                <label for={option.key}>{option.text}</label>
                <div className={styles.check}></div>
            </li> :

            <li key={option.key} 
                className={(this.state.active &&(this.state.index == option.key)) ? styles.active :''}>
                <input onClick={()=>this.toogleActiveClass(option.key)} type="radio" id={option.key} name={this.props.details.qid}/>
                <label for={option.key}>{option.text}</label>
                <div className={styles.check}></div>
            </li>
        }
        return (
            (optionWithClass)
        )
    });
    return(
        
    <div className={styles.container}>
        
        <h2>{this.props.details.text}</h2>
        
        <ul>
            {options}
        </ul>
        <button onClick={() => this.props.nextPrevHandler("prev", this.state.index,this.resetState())} className="btn btn-success">Previous</button>
        <button onClick={() => this.props.nextPrevHandler("next", this.state.index,this.resetState())} className="btn btn-success">Next</button>
    </div>
    )  
    }
}

export default Question;