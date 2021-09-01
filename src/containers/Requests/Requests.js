import React, {Componenet} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import camelcase from 'camelcase';

class Requests extends React.Component {
    state ={
        events: [],
        requests: [],
        loading: true,
        currentEventRequests:[]
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

        axios.get('/quizService/getRequests',{
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
            }
        }).then(res=>{
            const requests = res.data.data;
            console.log(requests);
            this.setState({requests: requests, loading: false});
        })
    }
    onEventChangeHandler = (e) =>{
        console.log(e.target.value);
        const eventCode = camelcase(e.target.value);
        const requests = this.state.requests.filter(request=> request.eventCode === eventCode);
        // console.log(responses);

        this.setState({currentEventRequests: requests});
    }
    render() {

        let options = null;
        options = this.state.events.map(event=>{
            return(
                <option value={event.name}>{event.name}</option>
            )
        });
        const requests = this.state.currentEventRequests.map(request=>{
            return(
                <div>
                    <p>{request.user.username}</p>
                    <p>{request.email}</p>
                    <p>{request.college}</p>
                    <p>{request.phone}</p>
                    {/* <input type="checkbox" id={response.user._id} name="Allowed" value="Bike"/> */}
                    {/* <label for="vehicle1">Allowed</label> */}
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
                {requests}
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