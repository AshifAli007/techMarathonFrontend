import {useEffect, useState} from 'react';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import { Collapse, List } from 'antd';
import { GiTrophyCup, GiTrophy } from "react-icons/gi";
import trophy1 from '../../assets/images/trophy1.png';
import trophy2 from '../../assets/images/trophy2.png';
import trophy3 from '../../assets/images/trophy3.png';
// import { Lisst } from 'antd/lib/form/Form';
const { Panel } = Collapse;

const token = localStorage.getItem('token');

const Results = () =>{
    useEffect(()=>{
        getResults();
    },[]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState();
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
    const getResults = async()=>{
        axios.get('/quizService/getWinners', config).then(res=>{
            const resultsData = res.data.data;
            setLoading(false);
            setResults(resultsData);
        })
    }
    if(loading){
        return <Loader />
    }
    var res=null;
    if(results){
        console.log(results)
        res = results.map((result)=>{
            if(result.length){
                let i=-1;
                return(
                    <Panel header={result[0].eventCode}>
                        {result.map((res)=>{
                            i++;
                            return(
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
                                    {" "}{res.user.name} - {res.user.college}
                                    
                                </List.Item>
                            )
                        })
                        
                        }
                    </Panel>
                )
                
            }else{
                return null;
            }
                
            
        })
    }
        
    return(
        <>
            {results &&
            
            <Collapse>
                {
                    res
                }
            </Collapse>
            }
        </>
    )
}


export default Results;