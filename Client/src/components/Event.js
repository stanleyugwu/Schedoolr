import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


class Event extends React.Component{

    constructor(props){
        super(props);
        this.dropMenu = this.dropMenu.bind(this);
        this.dropDesc = this.dropDesc.bind(this);
        this.calcSec = this.calcSec.bind(this);
        this.handleDelete = this.handleDelete.bind(this)

        this.state = {
            menuDropped: false,
            descriptionDropped: false
        }
    }

    //toggle event menu dropping
    dropMenu = () => {
        this.setState((prevState) => {
            return {
                menuDropped: prevState.menuDropped ? false : true
            }
        })
    }

    //toggle description dropping
    dropDesc = () => {
        this.setState((prevState) => {
            return {
                descriptionDropped: prevState.descriptionDropped ? false : true
            }
        })
    }

    //Change inputted duration to seconds
    calcSec = (duration) => {

        let sec = duration
        const day = Math.floor(sec / 86400) > 0 ? Math.floor(sec / 86400) + `Day${Math.floor(sec / 86400) > 1 ? 's ' : ' '}` : '';
        sec %= 86400;
        const hour = Math.floor(sec / 3600) > 0 ? Math.floor(sec / 3600) + `Hour${Math.floor(sec / 3600) > 1 ? 's ' : ' '}` : '';
        sec %= 3600;
        const min =Math.floor(sec / 60) > 0 ? Math.floor(sec / 60) + `Min${Math.floor(sec / 60) > 1 ? 's ' : ' '}` : '';
        sec %= 60;
        const seconds = sec > 0 ? sec + 'Sec' : '';//(Math.floor(sec / 60) == 0) ? '' : sec //: Math.floor(sec) + 'Sec' //> 0) ? Math.floor(sec) + 'sec' : ''//> 0 ? sec + 'Sec' : ''//> 0 ? sec + `second` : '';
        //${sec % 60 > 1 ? 's' : ''}` : '' ;


        const dur = day + '' + hour + '' + min + '' + seconds
        
        return dur;
    }

    //delete event
    handleDelete = (id) => {


        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className="custom-ui confirm-box">
                <h1>Delete Event &#128465;</h1>
                <p>Are you sure you want to delete this event?</p>
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    axios.delete("http://localhost:4000/api/delete/" + id).then((res) => {
                        if (res.status == 200) {

                            onClose();
                            localStorage.clear('schedoolrDataCache');
                        } else{
                            alert('Failed to Delete, Please Try Again!..')
                        }
                      });
                  }}>Yes</button>
              </div>
            );
          },
        });
         
    }
    
    render(){
       
        const event = this.props.event;
        const state = this.state;

        return (
            <div className="event-card">
                <div className="settings-tab">
                    <div className="settings-menu-btn" onClick={this.dropMenu} style={{ color: event.color }}><span className="fa fa-cogs"></span><span className={state.menuDropped ? 'fa fa-caret-up' : 'fa fa-caret-down'}></span></div>
                    <ul className="event-menu" style={
                        { maxHeight: state.menuDropped ? 800 + 'px' : 0,
                        boxShadow: state.menuDropped ? '0px 0px 7px #777' : 'none' }
                    }>
                            <li><Link to={'/addEdit/' + event._id} className="Link"><span className="fa fa-pen"></span>&ensp;<span>Edit</span></Link></li>
                        <li onClick={() => {this.handleDelete(event._id)}}><span className="fa fa-trash"></span>&ensp;<span>Delete</span></li>
                            <li><span className="fa fa-copy"></span>&ensp;<span>Copy</span></li>
                            <li><span>Created: {new Date(event.createdAt).toDateString()}</span></li>
                        </ul>
                </div>
                <div className="event-name"> <i className="fa fa-link" aria-hidden="true"></i> {event.eventName}</div>
                <div className="detail event-location"><span className="fa fa-map-marker"></span>&ensp;<span> {event.location}</span></div>
                <div className="timing-section">
                    <div className="detail event-startDate"><span className="fa fa-clock"></span>&ensp;<span>{new Date(event.startDate).toLocaleDateString().replace(/\//g, '-')} @ {new Date(event.startDate).toLocaleTimeString()} {(event.notified && event.notificationEmail.length > 3) ? <i className="fa fa-bell" style={{color:'#ff9800',transform: 'rotate(-35deg)'}} aria-hidden="true"></i> : ''/*Show bell icon when event is notified*/}</span></div>
                    <div className="detail event-duration"><span className="fa fa-stopwatch"></span>&ensp;<span>{this.calcSec(event.duration)}</span></div>
                </div>
                <div className="detail attendees"><span className="fa fa-users"></span>&ensp;<span>{event.attendees} Attendee{event.attendees > 1 ? 's' : ''}</span></div>
                <div className="detail email">{event.notificationEmail.length > 3 ? <span><span className="fa fa-bell"></span>&ensp;<span className="email-address">{event.notificationEmail}</span></span> : <span>  </span>}</div>

                <div className="detail description">
                    <span onClick={this.dropDesc}>
                        Description&ensp;<span className={state.descriptionDropped ? 'fa fa-caret-up' : 'fa fa-caret-down'}></span>
                    </span>
                    <div className="description-text" style={{height: state.descriptionDropped ? 'auto' : 0,}}>
                        {event.description}
                    </div>
                </div>

            </div>
        )
    }
}

export default Event;