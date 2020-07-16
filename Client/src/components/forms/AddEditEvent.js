import React from  'react';
import DateTime from "react-datetime";
import '../../../node_modules/react-datetime/css/react-datetime.css';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class AddEditEvent extends React.Component {

    constructor(props){
        super(props);
        this.attributeIsSupported = this.attributeIsSupported.bind(this);
        this.calcSec = this.calcSec.bind(this);
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

        this.state = {
          formInCreateState: true,
          editingId:''
        }


    }
    
    attributeIsSupported = (typeValue)=>{
        let element = document.createElement('input');
        let attributeValue = 'test';
        element.setAttribute('type',typeValue);
        element.setAttribute('value', attributeValue);
        return element.value !== attributeValue
    }

    calcSec = () => {
        
        //Change inputted duration to seconds
        const day = Math.abs(Number(this.day.current.value)) * 86400;
        const hour = Math.abs(Number(this.hour.current.value)) * 3600;
        const min = Math.abs(Number(this.min.current.value)) * 60;
        const sec = Math.abs(Number(this.sec.current.value)) * 1;

        return (day + hour + min + sec) || 1;

    }

    calcDate = () => {

      //change inputted date and time to seconds
      return new Date(this.date.current.value + ' ' + this.time.current.value).getTime()
      
    }

    //prevent user from entering trailing spaces in event name
    handleEmptyEventName = (event) => {
      event.target.value.startsWith(" ") ? event.target.value = "" : event.target.value
    }

    //prevent user from entering trailing spaces in event location
    handleEmptyLocation = (event) => {
      event.target.value.startsWith(" ") ? event.target.value = "" : event.target.value
    }

    //create new event
    handleCreateEvent = (event) => {

      event.preventDefault();

      //construct the json data to post to server
      const payload = {
        eventName: this.eventName.current.value.trim(),
        startDate: this.calcDate(),
        duration: this.calcSec(),
        location: this.location.current.value,
        description: this.description.current.value,
        attendees: Number(this.guests.current.value),
        color: (this.color.current.value) == '#ffffff' ? '#444444' : this.color.current.value,
        notified: (this.email.current.value.length > 1) ? false : true,
        createdAt: new Date().getTime(),
        notificationEmail: this.email.current.value
      };

      //if user is adding new event
      if(this.state.formInCreateState){

        axios.post("https://schedoolr-backend.herokuapp.com/api/add", payload).then((res)=>{

          if(res.status === 200){

            //if added to database

            console.log('data stored');

            //Clear Cache So as to cause loading in homepage/events page
            localStorage.clear('schedoolrDataCache')
            this.props.history.push('/');

          } else {
            
            //if not added to database
            confirmAlert({
              customUI: ({ onClose }) => {
              {setTimeout(onClose, 2000)}

                return (
                  <div className="custom-ui info-box">
                    <span className='x'>&#10060;</span>
                    <h3>Failed To Add Event!!</h3>
                    <p style={{fontSize: '1.8rem'}}>Please check the details and try again!!</p>
                  </div>
                );
              },
            });
          }
        }).catch((err)=>{

          //if cant connect to server
          console.log(err);

          confirmAlert({
            customUI: ({ onClose }) => {
              {
                setTimeout(onClose, 7000);
              }
              return (
                <div className="custom-ui info-box">
                  <span className='x'>&#10060;</span>
                  <h3>Connection Lost!!</h3>
                  <p style={{ fontSize: "1.8rem" }}>
                    Make sure you are connected to the internet and try again!!
                  </p>
                </div>
              );
            },
          });

        });

      }
      //if user editing event
      else if(!this.state.formInCreateState){

        axios.put('https://schedoolr-backend.herokuapp.com/api/modify/' + this.state.editingId, payload).then((res)=>{

          if(res.status == 200){

            //if updated in database
            confirmAlert({
              customUI: ({ onClose }) => {
                //&#10060 x &#9745 chk &#9989 wchk 
                { setTimeout(onClose, 2000) }

                return (
                  <div className="custom-ui info-box">
                    <i className="fa fa-check-circle fa-3x" aria-hidden="true"></i>
                    <p>Event Updated Successfully..</p>
                  </div>
                );
              },
            });

            setTimeout(this.props.history.push('/'), 2000);

          }else if (res.status == 400){

            //if not updated in database
            confirmAlert({
              customUI: ({ onClose }) => {
                //&#10060 x &#9745 chk &#9989 wchk 
                { setTimeout(onClose, 2000) }

                return (
                  <div className="custom-ui info-box">
                    <span className='x'>&#10060;</span>
                    <p>Event Modification Failed. please check the details and try again</p>
                  </div>
                );
              },
            });
          }
        }).catch((err)=>{
          //if cant connect to server
          console.log(err)
          confirmAlert({
            customUI: ({ onClose }) => {
              //&#10060 x &#9745 chk &#9989 wchk 
              { setTimeout(onClose, 80000) }

              return (
                <div className="custom-ui info-box">
                  <span className='x'>&#10060;</span>
                  <p>Connection Lost!! Please make sure you're connected to the internet and try again</p>
                </div>
              );
            },
          });
        });
      }

    }

    componentDidMount(){

   
      //If theres id in the url parameter, fetch the event with id from database and populate the form
      if (this.props.match.params.id) {

        axios.get('https://schedoolr-backend.herokuapp.com/api/get/' + this.props.match.params.id).then((res)=>{
        this.setState({ formInCreateState: false });
        this.setState({editingId: this.props.match.params.id});

        //fetch the event with provided id
        /* const event = {
          eventName: "Birthday",
          startDate: 1593802565816,
          duration: 86920,
          location: "hdjhjhsjh",
          description: "shjshjdshjdhsj",
          attendees: 89,
          color: "#173908",
          notified: true,
          createdAt: 7873874334,
          notificationEmail: "stanley@gmail.com"
        } */

        const event = res.data.Data;
        

        //transforming startDate into date
        //First Algorithm::
        /* let dt = new Date(event.startDate).toLocaleDateString().split('/');//Convert date to array
        let mnt = dt[0].length === 1 ? '0'+dt[0] : dt[0];//prefix month with trailing 0 if less than 10
        let dy = dt[1].length === 1 ? '0' + dt[1] : dt[1];//prefix month with trailing 0 if less than 10
        let date = [dt[2]/*year*///,mnt,dy].join('-');//rearrange date into yy:mm:dd */

        //Second Algorithm
        let dte = new Date(event.startDate).toISOString();
        let date = dte.substring(0, dte.indexOf('T'));

        //Transforming startDate into Time
        let tme = new Date(event.startDate).toTimeString();
        let time = tme.substr(0, 8);

        //transforming duration from seconds to dd:hh:mm:ss
        let sec = event.duration;
        let day = Math.floor(sec / 86400)
        sec %= 86400
        let hour = Math.floor(sec / 3600)
        sec %= 3600
        let min = Math.floor(sec / 60)
        let seconds = sec % 60

        //Populate Input tags with fetched data through refs
        this.eventName.current.value = event.eventName;
        this.date.current.value = date;
        this.time.current.value = time;
        this.day.current.value = day;
        this.hour.current.value = hour;
        this.min.current.value = min;
        this.sec.current.value = seconds;
        this.location.current.value = event.location;
        this.guests.current.value = event.attendees;
        this.email.current.value = event.notificationEmail;
        this.color.current.value = event.color;
        this.description.current.value = event.description;

      }).catch((err)=>{

        //if cant fetch event to edit from server 
        console.log(err);
        confirmAlert({
          customUI: ({ onClose }) => {
            {
              setTimeout(onClose, 8000);
            }
            return (
              <div className="custom-ui info-box">
                <span className='x'>&#10060;</span>
                <h3>Event Not Loaded!!</h3>
                <p style={{ fontSize: "1.8rem" }}>
                  Make sure you are connected to the internet and reload the page..
                </p>
              </div>
            );
          },
        });
      })
      } else if (!this.props.match.params.id) {
        
        //if fetched event to edit
        this.setState({ formInCreateState: true });
        document.querySelector('header .add-btn').setAttribute('style', `display: ${this.state.formInCreateState ? 'none' : 'initial'}`);
      }
  }

    render(){
        return (
          <form className="add-form" onSubmit={this.handleCreateEvent}>
            <p className="form-label">{this.state.formInCreateState ? 'Add New Event' : 'Editing Event'}</p>
            <div className="form-field name">
              <p className="field-label">Event Name: <sup><i className="fas fa-asterisk  fa-1x  "></i></sup></p>
              <input
                placeholder="Enter Event Name"
                list="events"
                autoFocus={true}
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
              <p className="field-label">Event Date: <sup><i className="fas fa-asterisk  fa-1x  "></i></sup></p>
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
                      defaultValue={new Date().toISOString().substring(0, new Date().toISOString().indexOf('T'))}
                      ref={this.date}
                    ></input>
                  </div>
                  <div className="time">
                    <p>Time:</p>
                    <input
                      type="time"
                      defaultValue="00:00"
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
                  defaultValue="0"
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
                  defaultValue="0"
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
                  defaultValue="0"
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
                  defaultValue="0"
                  name="second"
                  style={{ width: 60 + "px" }}
                  ref={this.sec}
                ></input>
              </div>
              </div>
            </div>

            <div className="form-field location">
              <p className="field-label">Event Location: <sup><i className="fas fa-asterisk  fa-1x  "></i></sup></p>
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
              ></input>
            </div>

            <div className="form-field description">
              <p className="field-label">Description:</p>
              <textarea type="text" max="1200" ref={this.description}></textarea>
            </div>

            <div className="form-field submit">
              <button type="submit" value="Submit" id="submit-btn">{this.state.formInCreateState ? 'Add Event' : 'Update Event'}</button>
            </div>
          </form>
        );
    }

}

export default AddEditEvent;