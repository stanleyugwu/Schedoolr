import React from 'react';
import Event from './Event';


class Events extends React.Component{
    constructor(props){
        super(props)
    }

    state = {
        events: [
            { "_id": "5ef7433210a54324ccf445a7", "color":"red","eventName": "Lust", "startDate": 1593263100000, "duration": 782544, "location": "No. 10 npi", "description": "Its my birthds", "attendees": 8, "createdAt": 445677789, "notificationEmail": "stanleyugwu@gmail.com", "__v": 0 },
            { "_id": "5ef7436710a54324ccf45a8", "color": "blue", "notified": false, "eventName": "BDAY", "startDate": 1593263220000, "duration": 782544, "location": "No. 10 npi", "description": "Its my birthds", "attendees": 8, "createdAt": 445677789, "notificationEmail": "stanleyugwu@gmail.com", "__v": 0 },
            { "_id": "5ef7433210a54324ccf44a7", "color": "red", "eventName": "Lust", "startDate": 1593263100000, "duration": 782544, "location": "No. 10 npi", "description": "Its my birthds", "attendees": 8, "createdAt": 445677789, "notificationEmail": "stanleyugwu@gmail.com", "__v": 0 },
            { "_id": "5ef7436710a54324ccf445a8", "color": "blue", "notified": false, "eventName": "BDAY", "startDate": 1593263220000, "duration": 782544, "location": "No. 10 npi", "description": "Its my birthds", "attendees": 8, "createdAt": 445677789, "notificationEmail": "stanleyugwu@gmail.com", "__v": 0 },
            { "_id": "5ef7433210a5432ccf445a7", "color": "red", "eventName": "Lust", "startDate": 1593263100000, "duration": 782544, "location": "No. 10 npi", "description": "Its my birthds", "attendees": 8, "createdAt": 445677789, "notificationEmail": "stanleyugwu@gmail.com", "__v": 0 },
            { "_id": "5ef7433210a54324ccf4457", "color": "red", "eventName": "Lust", "startDate": 1593263100000, "duration": 782544, "location": "No. 10 npi", "description": "Its my birthds djbd dj dj ijd dij dj dj dj idjcij cijd cijd cijd cijd cj dcijd cij dcij dcij cj dcijd cj jc dij cijd ", "attendees": 8, "createdAt": 445677789, "notificationEmail": "stanleyugwu@gmail.com", "__v": 0 }
        ]
    }

    componentDidMount(){
        console.log(this.state.events)
    }

    render(){
        return (
            <main className="main">
                <div className="filters-tab"><i className="fa fa-filter" aria-hidden="true"></i> Filter <i className="fa fa-caret-down" aria-hidden="true"></i></div>
                <div className="events-label">Upcoming Events <i className="fa fa-clock" aria-hidden="true"></i></div>

                <ul className="events-list">
                    {this.state.events.map(function(event){
                        return <li key={event._id} className="event">
                        <div className="color-tab" style={{ background: event.color, height: 6 + 'px'}}></div>
                        <Event event = {event}/>
                        </li>
                    })}
                </ul>
            </main>
        )
    }
}


export default Events;