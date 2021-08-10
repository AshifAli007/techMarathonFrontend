import React from 'react';
import styles from './Event.module.css';
import {Link} from 'react-router-dom';
import cx from 'classnames';
import CountDownTimer from '../../components/CountDownTimer/CountDownTimer';
function Event(props){
    let id = props.id;
    let hoursMinSecs = props.timeToLive;
    return(
            
            <div className={"col " + cx(styles.container, styles.event)}>
                <div className={styles.card}>
                    <h2>{props.event}</h2>
                    <CountDownTimer hoursMinSecs={hoursMinSecs}/>
                    {/* <p>{props.content}</p> */}
                
                        <Link to={props.isAuthenticated ? "/event/"+id : "/authentication"}>
                        <div className={cx(styles.right)}>
                            <i className="fa fa-arrow-right" ></i>
                            </div>
                        </Link>
                   
                    
                    <div className={styles.pic}></div>
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div className={styles.social}>
                    <i className="fa fa-facebook-f"></i>
                    <i className="fa fa-twitter"></i>
                    <i className="fa fa-instagram"></i>
                    <i className="fa fa-github"></i>
                    </div>
                    <Link to={props.isAuthenticated ? "/event/"+id : "/authentication"}> 
                        <button>
                        </button>
                    </Link>
                    
                </div>
            </div>
    )
}

export default Event;