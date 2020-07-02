import React from  'react';
import DateTime from "react-datetime";
import '../../../node_modules/react-datetime/css/react-datetime.css';


class AddEvent extends React.Component {

    constructor(props){
        super(props);
        this.attributeIsSupported = this.attributeIsSupported.bind(this);
        this.calcSec = this.calcSec.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.returnRefValue = this.returnRefValue.bind(this);
        this.calcDate = this.calcDate.bind(this);

        this.eventName = React.createRef();
        this.date = React.createRef();
        this.time = React.createRef();
        this.day = React.createRef();
        this.hour = React.createRef();
        this.min = React.createRef();
        this.sec = React.createRef();
        this.location = React.createRef();
        this.guests = React.createRef();
        this.email  = React.createRef();
        this.location = React.createRef();
        this.color = React.createRef();
        this.description = React.createRef();
    }

    attributeIsSupported = (typeValue)=>{
        let element = document.createElement('input');
        let attributeValue = 'test';
        element.setAttribute('type',typeValue);
        element.setAttribute('value', attributeValue);
        return element.value !== attributeValue
    }

    calcSec = () => {

        const day = Math.abs(Number(this.hour.current.value)) * 86400;
        const hour = Math.abs(Number(this.hour.current.value)) * 3600;
        const min = Math.abs(Number(this.min.current.value)) * 60;
        const sec = Math.abs(Number(this.sec.current.value)) * 1;

        return (day + hour + min + sec);

    }

    handleColor = () => {
      document.querySelector('#app').setAttribute('style',`background: ${this.color.current.value}`)
    }

    returnRefValue = (ref) => {
      return !!this.ref.current.value ? this.ref.current.value : null
    }

    calcDate = () => {
      return (Number.parseInt(this.time.current.value) * 3600) + (new Date(this.date.current.value).getTime() / 1000)
    }

    handleEmptyEventName = (event) => {
      event.target.value.startsWith(" ") ? event.target.value = "" : event.target.value
    }

  handleEmptyLocation = (event) => {
    event.target.value.startsWith(" ") ? event.target.value = "" : event.target.value
  }

    handleCreateEvent = (event) => {
      event.preventDefault();

      const payload = {
        eventName: this.eventName.current.value.trim(),
        startDate: this.calcDate(),
        duration: this.calcSec(),
        location: this.location.current.value,
        description: this.description.current.value,
        attendees: Number(this.guests.current.value),
        color: this.color.current.value,
        notified: (this.email.current.value.length > 1) ? false : true,
        createdAt: new Date().getTime(),
        notificationEmail: this.email.current.value
      }

    }

    render(){
        return (
          <form className="add-form" onSubmit={this.handleCreateEvent}>
            <p className="form-label">Add New Event</p>
            <div className="form-field name">
              <p className="field-label">Event Name:</p>
              <input
                placeholder="Enter Event Name"
                list="events"
                type="text"
                defaultValue=""
                required
                minLength="1"
                maxLength="50"
                onChange={this.handleEmptyEventName}
                ref={this.eventName}
              ></input>
              <datalist id="events">
                <option value="Birthday"></option>
                <option value="Wedding Party"></option>
                <option value="Bash Party"></option>
                <option value="Clubbing"></option>
              </datalist>
            </div>

            <div className="form-field date">
              <p className="field-label">Event Date:</p>
              {this.attributeIsSupported("date") &&
              this.attributeIsSupported("time") ? (
                <div className="datetime-wrapper">
                  <div className="date">
                    <p>Date:</p>
                    <input
                      type="date"
                      min="1800-01-01"
                      max="2070-12-25"
                      required
                      ref={this.date}
                    ></input>
                  </div>
                  <div className="time">
                    <p>Time:</p>
                    <input
                      type="time"
                      min="1800-01-01"
                      max="2070-12-25"
                      defaultValue="00:00:00"
                      ref={this.time}
                    ></input>
                  </div>
                </div>
              ) : (
                <DateTime
                  className="datetime-picker"
                  inputProps={{
                    readOnly: true,
                    max: "1800-01-01T00:00",
                    min: "2070-12-25T00:00",
                    required: true,
                  }}
                  onChange={this.handleDateTime}
                  closeOnSelect={true}
                  closeOnTab={true}
                />
              )}
            </div>

            <div className="form-field duration">
              <p className="field-label">Event Duration:</p>
              <div className="picker-wrapper">
              <div className="duration-picker day">
                <p>Day(s)</p>
                <input
                  type="number"
                  max="30"
                  min="0"
                  name="day"
                  defaultValue="1"
                  style={{ width: 60 + "px" }}
                  ref={this.day}
                ></input>
              </div>
              <div className="duration-picker hour">
                <p>Hour(s)</p>
                <input
                  type="number"
                  max="23"
                  min="0"
                  name="hour"
                  defaultValue="1"
                  style={{ width: 60 + "px" }}
                  ref={this.hour}
                ></input>
              </div>
              <div className="duration-picker minutes">
                  <p>Minute(s)</p>
                <input
                  type="number"
                  max="59"
                  min="0"
                  name="minute"
                  defaultValue="1"
                  style={{ width: 60 + "px" }}
                  ref={this.min}
                ></input>
              </div>
              <div className="duration-picker seconds">
                <p>Second(s)</p>
                <input
                  type="number"
                  max="59"
                  min="0"
                  defaultValue="1"
                  name="second"
                  style={{ width: 60 + "px" }}
                  ref={this.sec}
                ></input>
              </div>
              </div>
            </div>

            <div className="form-field location">
              <p className="field-label">Event Location:</p>
              <input
                placeholder="Enter event venue"
                type="text"
                maxLength="150"
                minLength = "2"
                onChange={this.handleEmptyLocation}
                required
                ref={this.location}
              ></input>
            </div>

            <div className="form-field guests">
              <p className="field-label">Event Guest(s):</p>
              <input type="number" min="0" max="9999999999" ref={this.guests} defaultValue="0" maxLength="20"></input>
            </div>

            <div className="form-field email">
              <p className="field-label">Notification Email:</p>
              <input type="email" ref={this.email} placeholder="eg. abc@gmail.com"></input>
            </div>

            <div className="form-field color">
              <p className="field-label">Choose Theme-Color:</p>
              <input
                type="color"
                defaultValue="#001c40"
                ref={this.color}
                onChange={this.handleColor}
              ></input>
            </div>

            <div className="form-field description">
              <p className="field-label">Description:</p>
              <textarea type="text" max="1200" ref={this.description}></textarea>
            </div>

            <div className="form-field submit">
              <button type="submit" value="Submit" id="submit-btn">Submit</button>
            </div>
          </form>
        );
    }

}

export default AddEvent;