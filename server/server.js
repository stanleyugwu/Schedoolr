const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//Import Models
const Events = require('./models/Event');
const Expired = require('./models/Expired');

//Mongoose Options
mongoose.set('useCreateIndex',true); 
mongoose.set('useUnifiedTopology',true);

//Connect to MongoDB
const database = 'Evently';
mongoose.connect('mongodb://127.0.0.1:27017/'+database, {useNewUrlParser: true})
const con = mongoose.connection;
con.once('open', ()=>{console.log("Server has established connection to database:",database)});


//Enable CORS
app.use(cors({origin: '*'}));

//Send 10 minutes Email
const sendReminderMail = (data) => {
    console.log(data.eventName + 'starting in less than 10 minutes');
}

//send event-started Email
const sendEventStartedMail = (data) => {
    console.log(data.eventName + 'started')
}

//Daemon 1 (Background Process for tracking events time and sending reminder emails)
setInterval(() => {

    Events.find((err, events) => {

        if (err) {
            console.log('Error Accessing Table')
        }

        events.map((event) => {

            const remainingTime = Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / 60000); //Calculate Remaining Minutes Before Event Starts
            
            if (remainingTime > 0 && remainingTime <= 10/*notification time*/ && event.notificationEmail && !event.notified) {

                sendReminderMail(event);//Send Email

                event.notified = true;//mark event as notified

                //Save back event
                event.save((err, res) => {
                    if(err){
                        console.log(err);
                        event.notified = false;//set room for re-mailing if failed to save
                    }
                });
                
            } else if (remainingTime > 0 && remainingTime <= 10/*notification time*/ && !!event.notificationEmail && !event.notified) {
                event.notified = true;
                event.save((err, res) => {
                    if (err) {
                        console.log(err);
                        event.notified = false;
                    }
                })
                
            }
        });
    });
}, 2000);


//Daemon 2
setInterval(() => {
    const date = new Date().getTime();
    Events.find((err, events) => {
        if(err){console.log('Error Accessing Table')}
        else{
            events.map((event)=>{
                if(new Date(event.startDate).getTime() <= date && Math.floor((date - new Date(event.startDate).getTime()) / 60000) <= 2 && event.notificationEmail.length > 1/*if event has reached or passed unknowingly and its less than 2 minutes passed and theres email for notif, then send mail  */){
                    
                    sendEventStartedMail(event);

                    const newDoc = {
                        eventName: event.eventName,
                        startDate: event.startDate,
                        duration: event.duration,
                        location: event.location,
                        description: event.description,
                        attendees: event.attendees,
                        color: event.color,
                        notified: event.notified,
                        createdAt: event.createdAt,
                        notificationEmail: event.notificationEmail
                    };

                    const expired = new Expired(newDoc);

                    expired.save();//move event to expired
                    event.remove();//remove from events

                } else if (new Date(event.startDate).getTime() <= date && Math.floor((date - new Date(event.startDate).getTime()) / 60000) > 5){
                    
                    console.log('Event reached but too late for reminding');
                    
                    const newDoc = {
                        eventName: event.eventName,
                        startDate: event.startDate,
                        duration: event.duration,
                        location: event.location,
                        description: event.description,
                        attendees: event.attendees,
                        color: event.color,
                        notified: event.notified,
                        createdAt: event.createdAt,
                        notificationEmail: event.notificationEmail
                    };

                    const expired = new Expired(newDoc);
                    expired.save();
                    event.remove();

                } else if (new Date(event.startDate).getTime() < date) {


                    console.log('Event Passed');

                    const newDoc = {
                        eventName: event.eventName,
                        startDate: event.startDate,
                        duration: event.duration,
                        location: event.location,
                        description: event.description,
                        attendees: event.attendees,
                        color: event.color,
                        notified: event.notified,
                        createdAt: event.createdAt,
                        notificationEmail: event.notificationEmail
                    };

                    const expired = new Expired(newDoc);
                    expired.save();
                    event.remove();

                }
            });
        }
    });
}, 500)

//Daemons Ended


let requestCounter = 0;

//Get Events
app.get("/api/events", (req, res) => {
    requestCounter+=1;
    console.log('Client Wants Events ' + requestCounter);
    Events.find((err, events)=>{
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).json(events);
            console.log('Events Sent!')
        }
    })
});

//Get Single event
app.get("/api/get/:id", (req, res) => {
    const id = req.params.id;
    Events.findOne({ _id: id }, (err, doc) => {
        if (err) {
            res.status(400).json({ "status": "Get FAILED!!", "Error": err })
        } else {
            res.status(200).json({ "Status": "Get Successful", "Data": doc })
        }
    })
});

//Get Expired Events
app.get("/api/events/expired", (req, res) => {
    Expired.find((err, events) => {
        if (err) { res.status(400).send(err) } else { res.json(events) }
    });
});

//Clear Expired Events
app.post("/api/events/expired/clear", (req, res) => {
    Expired.deleteMany({}, (err, events) => {
        if (err) { res.status(400).send(err) }
    });
});

//Add Events
app.post("/api/add", (req, res) => {
    const event = new Events(req.body);
    event.save().then(event => {
        res.status(200).json({'status':'Added successfully!',"Added:":event})
    }).catch(err => {
        res.status(400).json({"Status":"Not Added","Error":err.message})
        console.log(err)
    });
});

//Delete event
app.delete("/api/delete/:id", (req, res) => {
    const id = req.params.id;
    Events.deleteOne({ _id: new mongoose.Types.ObjectId(id) }, (err, results) => {
        if(err){res.status(400).json({"status":"NOT! Deleted","error":err})}else{res.send('Deleted Successfully!')}
    });
});


//Update event
app.put("/api/modify/:id", (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Events.findOneAndUpdate({_id:id}, data, {'useFindAndModify': false}, (err, doc)=>{
        if(err){
            res.status(400).json({"status":"MODIFICATION FAILED!!","Error":err})
    }else{
        res.status(200).json({"Status":"Update Successful","Data":doc})
    }
    });
});


app.listen(PORT, ()=>{console.log('Server Started Successfully!!','\nRunning On Port :'+PORT)})