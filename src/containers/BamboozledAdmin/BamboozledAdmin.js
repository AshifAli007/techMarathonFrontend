import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import camelcase from 'camelcase';
import { Select } from 'antd';
import { Table, Switch, message } from 'antd';
import './BamboozledAdmin.css';
const { Option } = Select;


class Responses extends React.Component {
    state ={
        events: [],
        responses: [],
        loading: true,
        currentEventResponse:[]
    }
    config = {
        headers: {
            'Authorization': `Bearer ${this.props.token}`,
        }
    }
    componentDidMount(){

        axios.get('/bamboozled/getLeaderboard', this.config).then(res=>{
            const responses = res.data.data;
            console.log(responses, "i am response");
            this.setState({responses: responses, loading: false, currentEventResponse: responses});
        })
    }
    refresh = () =>{
        this.setState({loading: true});
        axios.get('/bamboozled/getLeaderboard', this.config).then(res=>{
            const responses = res.data.data;
            console.log(responses, "i am response");
            this.setState({responses: responses, loading: false, currentEventResponse: responses});
        })
    }
    addToFinals = async(event, resId) => {
        const body = {
            id:resId,
            finals: event
        }
        axios.put('/quizService/updateResponse', body, this.config).then(()=>{
            message.success('Response Updated');
        });
    }
    onEventChangeHandler = (e) =>{
        console.log(e);
        const eventCode = camelcase(e);
        const responses = this.state.responses.filter(response=> response.eventCode === eventCode);

        this.setState({currentEventResponse: responses});
    }
    
    render() {
        const columns = [
            {
                title: 'Index',
                key: 'index',
                render:(text, record, index)=>{
                    return index+1;
                    
                }
              },
            {
              title: 'Name',
              dataIndex: 'user',
              key: 'user',
              render:(text, record)=>{
                  return record.user.name;
                  
              }
            },
            {
                title: 'Course',
                dataIndex: 'user',
                key: 'user',
                render:(text, record)=>{
                    return record.user.course;
                    
                }
            },
            {
                title: 'Phone',
                dataIndex: 'user',
                key: 'user',
                render:(text, record)=>{
                    return record.user.phone;
                    
                }
            },
            {
                title: 'Email',
                dataIndex: 'user',
                key: 'user',
                render:(text, record)=>{
                    return record.user.username;
                    
                }
            },
            {
                title: 'College',
                dataIndex: 'user',
                key: 'user',
                render:(text, record)=>{
                    return record.user.college;
                    
                }
            },
            {
                title: 'Event',
                dataIndex: 'eventCode',
                key: 'eventCode',
                render:(text, record)=>{
                    return "Bamboozled";
                }
              },
              {
                title: 'Current Question',
                dataIndex: 'currentQuestion',
                key: 'currentQuestion',
                render:(text, record)=>{
                    return record.currentQuestion;
                }
              },
              {
                title: 'No Of Tries',
                dataIndex: 'noOfTries',
                key: 'noOfTries',
                render:(text, record)=>{
                    return record.noOfTries;
                }
              },
              {
                title: 'Hints Used',
                dataIndex: 'hintsUsed',
                key: 'hintsUsed',
                render:(text, record)=>{
                    return record.hintsUsed;
                }
              },
              {
                title: 'Score',
                dataIndex: 'totalPoints',
                key: 'score',
              }
        ];
        return(
            this.state.loading ? <Loader/>:
            <div style={{position:'relative'}}>
                <button className="refreshButton" onClick={this.refresh}>Refresh - {this.state.currentEventResponse.length}</button>
                <Table 
                    columns={columns}
                    loading={this.state.loading}
                    dataSource={this.state.currentEventResponse} 
                    pagination={false}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        token: state.auth.token,
    }
}
export default connect(mapStateToProps)(Responses);