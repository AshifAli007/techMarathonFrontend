import React, { Component } from 'react';
import styles from './Options.module.css';

class Options extends Component {
    render(){

        
        return(
            <div className={styles.container}>

            
            <li>
                <input  value={this.props.option.key} 
                        checked={this.props.checked}
                        onChange={this.props.onValueChange} 
                        type="radio" 
                        id={this.props.option.key} 
                        name={this.props.details.qid}
                />
                <label for={this.props.option.key}>{this.props.option.text}</label>
                <div className={styles.check}></div>
            </li>
            </div>
        )
    }
}

export default Options;