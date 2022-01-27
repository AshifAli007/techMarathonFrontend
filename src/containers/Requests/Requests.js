import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import camelcase from 'camelcase';
import { Table, Switch, message } from 'antd';

class Requests extends React.Component {
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

        axios.get('/quizService/getRequests', this.config).then(res=>{
            const responses = res.data.data;
            console.log(responses);
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
        console.log(e.target.value);
        const eventCode = camelcase(e.target.value);
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
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'College',
              dataIndex: 'college',
              key: 'college',
            },
            {
                title: 'Event',
                dataIndex: 'eventCode',
                key: 'eventCode',
              },
              {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
              }
        ];
        let options = null;
        options = this.state.events.map(event=>{
            return(
                <option value={event.name}>{event.name}</option>
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
                <label for="events">Event Name:</label>

                <select onChange={(e)=>this.onEventChangeHandler(e)} name="events" id="events">
                    <option value='Select Event'>Select Event</option>
                    {options}
                </select>
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
export default connect(mapStateToProps)(Requests);