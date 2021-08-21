import React, { Component } from 'react';
import styles from './Loader.module.css';

function Loader(props){
    return (
        <div className={styles.container}>
                <div className={styles.body}>
                    <span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <div className={styles.base}>
                        <span></span>
                        <div className={styles.face}></div>
                    </div>
                    </div>
                    <div className={styles.longfazers}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <h1>Loading</h1>

        </div>


    )
}

export default Loader