import React from 'react';
import Event from './Event';
import axios from 'axios';
import "../../node_modules/react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class Events extends React.Component{

    constructor(props){
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }

    state = {
        events: [],
        loading: true,
        goneOffline: false,
        offline:false
    }

    //fetch events from database and set state
    fetchData = () => {

        axios.get('https://schedoolr-backend.herokuapp.com/api/events').then((res) => {

        if(res.status == 200){

          //fetched events

          if (!!!localStorage.schedoolrDataCache) {
            localStorage.setItem('schedoolrDataCache', JSON.stringify(res.data));
          }

          this.setState(() => {
            return { events: res.data, loading: false, goneOffline: false, offline: false }
          }
          );

        }else {
                //if not fetched events
                
                confirmAlert({
                  customUI: ({ onClose }) => {
                    {
                      setTimeout(onClose, 2000);
                      setTimeout(()=>{location.reload()}, 5000)
                    }

                    clearInterval(this.interval)

                    return (
                      <div className="custom-ui info-box">
                        <h3>Failed To Load Events!!</h3>
                        <p style={{ fontSize: "1.8rem" }}>
                          Please try again!! by reloading the page
                        </p>
                      </div>
                    );
                  }
                });
              }
        }).catch((err)=>{

          console.log(err);//log error

          //if there's cached event show error panel else display full error image
          if (
            !!localStorage.schedoolrDataCache &&
            JSON.parse(localStorage.schedoolrDataCache).length > 0
          ) {

            this.setState({goneOffline: true});
            //setInterval(()=>{console.clear()}, 10000)//clear console every 10 seconds

          } else {

            this.setState({ loading: false, goneOffline: false, offline: true }); //set offline to true to show error pic
            setInterval(() => { console.clear() }, 10000)//clear console every 10 seconds

          }
      });

     } 
    

    componentDidMount(){
      //show add-btn
      document.querySelector('header .add-btn').setAttribute('style', 'display:initial');

      //load cached data from localStorage into state and prevent loading,
      //and re-fetching data for some seconds else load and fetch data
      if(!!localStorage.schedoolrDataCache && JSON.parse(localStorage.schedoolrDataCache).length > 0){
        
        this.setState({events: JSON.parse(localStorage.getItem('schedoolrDataCache')), loading: false});
        this.interval = setInterval(this.fetchData, 1000);
        //localStorage.setItem('schedoolrDataCache',JSON.stringify([]))

      }else{
        this.interval = setInterval(this.fetchData, 1000);
      }
    }

    componentWillUnmount(){
      //when unmounting component, stop fetching new data, and store current data
      //in localStorage as cache so as to prevent refetch when component remounts
      localStorage.setItem('schedoolrDataCache', JSON.stringify(this.state.events));

      clearInterval(this.interval);
    }

    render(){
        return (
          <main className="main">
            {this.state.goneOffline &&
              <div className="gone-off">
                You have gone offline!!<br/>
                Basic actions can't be performed while offline, please reconnect to internet
            </div>}
              <div
                className="events-count-label"
                style={{ display: (this.state.offline || this.state.loading) ? 'none' : 'block' }}
              ><span>
                {this.state.events.length || "No "} Upcoming Event
                {this.state.events.length > 1 ? "s " : " "}
                <i className="fa fa-clock" aria-hidden="true"></i>
                </span>
              </div>

            <ul className="events-list" style={{ background: this.state.offline ? '#f3f3f3' : 'initial'}}>
              <div style={{display: this.state.loading ? "block" : "none", marginTop: '5%'}}>
                <Loader
                  type="BallTriangle"
                  color="#001c40"
                  height={100}
                  width={100}
                />
                <div
                  style={{
                    padding: "5% 0 0 1.5%",
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#555",
                  }}>
                  Loading...
                </div>
              </div>
              {this.state.offline &&
                <div>
                   <img src="/images/noConnection.gif" onClick={()=>{location.reload()}} style={{cursor: 'pointer', width: '100%', height: '100%'}}></img>
                </div>}
              {this.state.events.map((event) => {
                return (
                  <li key={event._id} className="event">
                    <div
                      className="color-tab"
                      style={{ background: event.color, height: 6 + "px" }}
                    ></div>
                    <Event event={event} />
                  </li>
                );
              })} 
            </ul>
          </main>
        );
    }
}


export default Events;