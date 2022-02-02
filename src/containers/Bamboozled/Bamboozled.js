import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from '../../components/Loader/Loader';
import { Input, Button,Drawer, notification, Divider, Space,Progress, message, List } from 'antd';
import trophy1 from '../../assets/images/trophy1.png';
import trophy2 from '../../assets/images/trophy2.png';
import trophy3 from '../../assets/images/trophy3.png';
import './Bamboozled.css';


const Bamboozled = () =>{
    const userId = JSON.parse(localStorage.getItem('userId'))['_id'];
    // const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState();
    const [leaderboard, setLeaderboard] = useState([]);
    const [answer, setAnswer] = useState("");
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
        getQuestion();
        getLeaderboard();
    },[]);
    const successNotification = placement => {
        notification.success({
          message: `Success`,
          description:
            'Well done! Next image is unlocked',
          placement,
        });
      };
      const incorrectNotification = placement => {
        notification.warning({
          message: `Incorrect`,
          description:
            'Sorry Not this! Try again',
          placement,
        });
      };
    const getLeaderboard = ()=>{
        try{
            axios.get('/bamboozled/getLeaderboard',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }).then(res=>{
                const leaderboard = res.data.data;
                setLeaderboard(leaderboard);
            })
        }catch(err){
            message.error('cannot get leaderboard');
        }
    }
    const getQuestion = ()=>{
        try{
            axios.get(`/bamboozled/getQuestion/${userId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }).then(res=>{
                const question = res.data.data;
                setQuestion(question);
                setLoading(false);
            });
        }catch(e){
            console.log('unablel to get leaderboard');
        }

    }   
    const checkAnswer = () =>{
        const body = {
            userId: userId,
            answer: answer,
        }
        axios.post('/bamboozled/checkAnswer/',body,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res=>{
            let isCorrect = res.data.data.isCorrect;
            if(!isCorrect){
                incorrectNotification("bottomRight");
            }else{
                successNotification("bottomRight");
            }
            getQuestion();
            setAnswer("");
        });
    }
    return(
        
            <>
            {
                loading?
                 <Loader />
                 :
                    <div style={{
                        display:"flex",
                        justifyContent: "center",
                        position: "relative",
                    }}>
                        
                    <div style={{
                        display: "flex",
                        flexFlow: "column wrap",
                        alignItems: "center",
                    }}>
                        <i><h1 className="title">Bamboozled</h1></i>
                        <div>
                                <img style={{
                                     width: "100%",
                                     maxWidth: "600px",
                                     height: "auto",
                                     margin: "0% auto 2% auto",
                                     borderRadius:"2%",
                                     boxShadow:"0 5px 5px #1f5962",
                                }} alt="" src={question.image}></img>
                            </div>
                            <input 
                                className='answer'
                                value={answer} 
                                placeholder="Enter Answer" 
                                onChange={(e)=>setAnswer(e.target.value)}/>
                            {
                                question.hints.map((hint)=>{
                                    return(
                                        <p className="hint">{hint}</p>
                                    )
                                })
                            }
                            
                            <button className='checkButton' style={{width:'100%', marginTop:'2%'}} onClick={()=>checkAnswer()}> Check Answer</button>
                        </div>
                        <button className='leaderboard' onClick={()=>{
                                getLeaderboard();
                                setVisible(true);
                            }
                        }>
                            Leaderboard
                        </button>
                        <Drawer title="Leaderboard" placement="left" onClose={()=>setVisible(false)} visible={visible}>
                            {leaderboard.map((player, i)=>{

                                return(
                                    <>
                                        <List.Item>
                                        {i===0 && <><img alt="" style={{marginRight: '7px'}} src={trophy1}/></>}
                                    {i===1 && <img alt="" style={{
                                            width:'37px',
                                            position: "relative",
                                            right: "3px",
                                        }} src={trophy2}/>}
                                    {i===2 && <><img style={{
                                            width:'37px',
                                            position: "relative",
                                            right: "3px",
                                        }} alt="" src={trophy3}/></>}
                                            {player.user.name}
                                            <Progress
                                            style={{width:"87%"}}
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                            percent={(player.totalPoints*100)/2500}
                                            showInfo={false}
                                            />
                                            <p style={{display:'inline', marginLeft:'3%'}}>{player.totalPoints}</p>
                                            {/* {player.totalPoints} */}
                                        </List.Item>
                                    </>
                                )
                            })}
                        </Drawer>
                    </div>
            }
   
        </>
    )
}


export default Bamboozled;