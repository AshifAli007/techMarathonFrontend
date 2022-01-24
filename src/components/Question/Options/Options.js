import React, { Component } from 'react';
import styles from './Options.module.css';

class Options extends Component {
    render(){

        
        return(
            <div className={styles.container}>

            
            <li>
                <input  value={this.props.option.key} 
                        checked={this.props.checked}
                        onClick={this.props.onValueChange.bind(this, this.props.checked)}
                        type="radio"
                        id={this.props.option.key} 
                        name={this.props.details.qid}
                />
                <div className={styles.check}></div>
                <label for={this.props.option.key}>{this.props.option.text}</label>
                
            </li>
            </div>
        )
    }
}

export default Options;