import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import camelcase from 'camelcase';
import { Select } from 'antd';
import { Table, Switch, message } from 'antd';
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
        axios.get('/eventService/getEvents',{
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
            }
        })
                .then(res=>{
                    const events = res.data.data;
                    console.log(events);
                    this.setState({events: events});

                });

        axios.get('/quizService/getResponses', this.config).then(res=>{
            const responses = res.data.data;
            console.log(responses);
            
            responses.sort((a, b)=> a.score < b.score ? 1:-1);
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
              },
              {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
              },
              {
                title: 'Finals',
                dataIndex: 'finals',
                key: 'finals',
                render: (text, record)=>{
                    return <Switch defaultChecked={record.finals} onChange={(e)=>this.addToFinals(e, record._id)} />
                }
              },
        ];
        let options = null;
        options = this.state.events.map(event=>{
            return(
                <Option value={event.name}>{event.name}</Option>
            )
        });
        const responses = this.state.currentEventResponse.map(response=>{
            return(
                <div>
                    <p>{response.user.username}</p>
                    <p>{response.email}</p>
                    <p>{response.college}</p>
                    <p>{response.score}</p>
                    <input type="checkbox" id={response.user._id} name="final" value="Bike"/>
                    <label for="vehicle1">Finals</label>
                    <hr></hr>
                </div>
            )
        })
        return(
            this.state.loading ? <Loader/>:
            <div>
                <Select 
                    placeholder="Select a Event" 
                    style={{
                        width: '200px',
                        margin:'2% auto 2% 5%'
                    }} 
                    onChange={(e)=>this.onEventChangeHandler(e)} 
                    name="events">
                    <Option value='Select Event'>Select Event</Option>
                    {options}
                </Select>
                <Table 
                    columns={columns}
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