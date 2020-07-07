import React from 'react';
import Event from './Event';
import axios from 'axios';
import "../../node_modules/react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class Events extends React.Component{

    constructor(props){
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }

    state = {
        events: [],
        loading: true
    }

    //fetch events from database and set state
    fetchData = () => {

        axios.get('http://localhost:4000/api/events').then((res) => {

        if(res.status == 200){
          if (!!localStorage.eventlyDataCache) {
            localStorage.removeItem('eventlyDataCache');
          }
          this.setState(() => {
            return { events: res.data, loading: false }
          }
          );
        }else {
          console.log('Failed to get events')
        }

        });

      } 
    

    componentDidMount(){
      //show add-btn
      document.querySelector('header .add-btn').setAttribute('style', 'display:initial');

      //load cached data from localStorage into state and prevent loading,
      //and re-fetching data for some seconds else load and fetch data
      if(!!localStorage.eventlyDataCache && JSON.parse(localStorage.eventlyDataCache).length >= 1){
        
        this.setState({events: JSON.parse(localStorage.getItem('eventlyDataCache')), loading: false});
        this.interval = setInterval(this.fetchData, 1000);
        //localStorage.setItem('eventlyDataCache',JSON.stringify([]))

      }else{
        this.interval = setInterval(this.fetchData, 2000);
      }
    }

    componentWillUnmount(){
      //when unmounting component, stop fetching new data, and store current data
      //in localStorage as cache so as to prevent refetch when component remounts
      clearInterval(this.interval);
      localStorage.setItem('eventlyDataCache',JSON.stringify(this.state.events));
    }

    render(){
        return (
          <main className="main">
            <div className="filters-tab">
              <i className="fa fa-filter" aria-hidden="true"></i> Filter{" "}
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </div>
            {this.state.loading || (
              <div className="events-label">
                {this.state.events.length || 'No '} Upcoming Event
                {this.state.events.length > 1 ? "s " : " "}
                <i className="fa fa-clock" aria-hidden="true"></i>
              </div>
            )}

            <ul className="events-list">
              <div
                style={{
                  display: this.state.loading ? "block" : "none"
                }}
              >
                <Loader
                  type="BallTriangle"
                  color="#001c40"
                  height={100}
                  width={100}
                />
                <div style={{padding: '5% 0 0 1.5%',fontSize: '2.5rem', fontWeight: '700', color: '#555'}}>Loading...</div>
              </div>

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