import React from 'react';
import ReactDOM from 'react-dom';

class Event extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            menuDropped: false,
            descriptionDropped: false
        }
    }

    dropMenu = () => {
        this.setState(function(prevState){
            return {
                menuDropped: prevState.menuDropped ? false : true
            }
        })
    }

    dropDesc = () => {
        this.setState(function (prevState) {
            return {
                descriptionDropped: prevState.descriptionDropped ? false : true
            }
        })
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
                            <li><span className="fa fa-pen"></span>&ensp;<span>Edit</span></li>
                            <li><span className="fa fa-trash"></span>&ensp;<span>Delete</span></li>
                            <li><span className="fa fa-copy"></span>&ensp;<span>Copy</span></li>
                            <li><span>Created:{event.createdAt}</span></li>
                        </ul>
                </div>
                <div className="event-name"> <i className="fa fa-link" aria-hidden="true"></i> {event.eventName}</div>
                <div className="detail event-location"><span className="fa fa-map-marker"></span>&ensp;<span> {event.location}</span></div>
                <div className="timing-section">
                    <div className="detail event-startDate"><span className="fa fa-clock"></span>&ensp;<span>{event.startDate}</span></div>
                    <div className="detail event-duration"><span className="fa fa-stopwatch"></span>&ensp;<span>{Math.floor(event.duration / 1000 / 60)}</span></div>
                </div>
                <div className="detail attendees"><span className="fa fa-users"></span>&ensp;<span>{event.attendees} Attendees</span></div>
                <div className="detail description">
                    <span onClick={this.dropDesc}>
                        Description&ensp;<span className={state.descriptionDropped ? 'fa fa-caret-up' : 'fa fa-caret-down'}></span>
                    </span>
                    <div className="description-text"
                        style={
                            {
                                height: state.descriptionDropped ? 'auto' : 0,
                            }
                        }
                    >
                        {event.description}
                    </div>
                </div>

            </div>
        )
    }
}

export default Event;