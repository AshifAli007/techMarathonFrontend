import React, {Componenet} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import camelcase from 'camelcase';

class Responses extends React.Component {
    state ={
        events: [],
        responses: [],
        loading: true,
        currentEventResponse:[]
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

        axios.get('/quizService/getResponses',{
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
            }
        }).then(res=>{
            const responses = res.data.data;
            console.log(responses);
            this.setState({responses: responses, loading: false});
        })
    }
    onEventChangeHandler = (e) =>{
        console.log(e.target.value);
        const eventCode = camelcase(e.target.value);
        const responses = this.state.responses.filter(response=> response.eventCode === eventCode);
        // console.log(responses);

        this.setState({currentEventResponse: responses});
    }
    render() {

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
                {responses}
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