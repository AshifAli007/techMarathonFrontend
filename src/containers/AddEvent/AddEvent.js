import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
class AddEvent extends React.Component {
    state = {
        eventDetails:{
            name: '',
            description:'',
            endTime:'2021-08-30T15:30',
            
        },
        isSubmitted: false,
    }
    handle = (e)=> {
        const newEventDetails = {...this.state.eventDetails};
        newEventDetails[e.target.id] = e.target.value;
        this.setState({eventDetails: newEventDetails});
        console.log(newEventDetails);
    }
    submit = (e) =>{
        let url = 'http://localhost:8000/v1/eventService/addEvent';
        e.preventDefault();
        axios.post(url,{
            eventDetails:[{
                ...this.state.eventDetails,
            }]
            
        },{
            headers:{
                'authorization' : `Bearer ${this.props.token}`,
            }
        }).then(res=>{
            console.log(res,Date.now());
            this.setState({isSubmitted: !this.state.isSubmitted});
        })
        console.log(this.state.eventDetails);
    }
    render(){
        
    return(
        <div>
            {this.state.isSubmitted ? <Redirect to="events"/> : null}
            <form onSubmit={(e)=>this.submit(e)}>
                <input type="text" onChange={(e)=>this.handle(e)} id='name' value={this.state.eventDetails.name} placeholder="Event name" name="hello"/>
                <input type="text" onChange={(e)=>this.handle(e)} id='description' value={this.state.eventDetails.description} placeholder="Description"/>
                <input type="datetime-local" onChange={(e)=>this.handle(e)} id='endTime' value={this.state.eventDetails.endTime} placeholder="End Time"/>
                <button type="submit">Submit</button>
            </form>
            <h1>This is the add event form</h1>
        </div>
    )
    }
}

const mapStateToProps = (state) =>{
    return {
        token: state.auth.token,
    }
}

export default connect(mapStateToProps)(AddEvent);