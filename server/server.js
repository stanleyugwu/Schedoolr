const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PORT = process.env.PORT || 4000;


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
const database = 'Schedoolr';
const connection = 'mongodb://localhost:27017/' + database// + database;//mongodb + srv:schedoolr:obiorastan1@schedoolr.flef2.mongodb.net/Schedoolr?retryWrites=true&w=majority';
mongoose.connect(connection, {useNewUrlParser: true}).then(()=>{
    console.log("Server has established connection to database:", database)
}
).catch((err)=>{
    console.log(err.message)
})

//Enable CORS
app.use(cors({origin: '*'}));

//Nodemail transporter

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eventSkedulr@gmail.com',
        pass: 'obiorastanley1'
    },
    tls: { rejectUnauthorized: false }/* ,
    debug: true,
    logger: true */
});


async function sendReminderMail (data) {

    let mailOptions = {
        from: 'Events@Schedoolr.com',
        to: data.notificationEmail,
        subject: 'Event Starting Soon..',
        html: `<h2>It's About To Begin...</h2><p>Hello Dear,</p><p><b>The ${data.eventName} Event You registered, will be starting 10 minutes from now, so we sent you this mail to notify you of it.</b></p><p>The event will be taking place at ${data.location}. Do have a great day with your event..#best wishes</p>`
    }
    clearInterval(daemon1Interval);

    const send = await transporter.sendMail(mailOptions).catch((err)=>{
        console.log(err)
    });

    console.log(data.eventName + ' starting in less than 10 minutes');

    setTimeout(()=>{setInterval(daemon1, 2000)}, 5000)
    
    return (!!send)
  
}

//send event-started Email
async function sendEventStartedMail (data) {

    let mailOptions = {
        from: 'Events@Schedoolr.com',
        to: data.notificationEmail,
        subject: 'Event Started..',
        html: `<h2>It's Time!!...</h2><p>Hello Dear,</p><p><b>${data.eventName} must have begun now or is happening already, and we hope it's all going/went as planned.</b></p><p>Do have a great day with your event..#best wishes</p>`

    }
    clearInterval(daemon1Interval);

    const send = await transporter.sendMail(mailOptions).catch((err) => {
        console.log(err)
    });

    console.log(data.eventName + ' started');

    setTimeout(() => { setInterval(daemon2, 500) }, 3000)

    return (!!send)


}

//Daemon 1 (Background Process for tracking events time and sending reminder emails)
const daemon1 = () => {
        Events.find((err, events) => {

            if (err) {
                console.log('Error Accessing Table')
            }

            events.map(async (event) => {

                const remainingTime = Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / 60000); //Calculate Remaining Minutes Before Event Starts

                if (remainingTime > 0 && remainingTime <= 10/*notification time*/ && event.notificationEmail && !event.notified) {
                   
                     var sentEmail = await sendReminderMail(event).catch(console.log)

                    if(sentEmail){

                        event.notified = true;//mark event as notified

                        console.log(event.notified)

                        //Save back event
                        event.save((err, res) => {
                            if (err) {
                                console.log(err);
                                event.notified = false;//set room for re-mailing if failed to save
                            }
                        });
                    }

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
}

const daemon1Interval = setInterval(daemon1, 2000);


//Daemon 2
const daemon2 = () => {


    const date = new Date().getTime();
    Events.find((err, events) => {
        if (err) { console.log('Error Accessing Table') }
        else {
            events.map((event) => {
                if (new Date(event.startDate).getTime() <= date && Math.floor((date - new Date(event.startDate).getTime()) / 60000) <= 2 && event.notificationEmail.length > 1/*if event has reached or passed unknowingly and its less than 2 minutes passed and theres email for notif, then send mail  */) {

                    const sentMail = sendEventStartedMail(event).catch(console.log);

                    if (sentMail) {
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
                    }

                } else if (new Date(event.startDate).getTime() <= date && Math.floor((date - new Date(event.startDate).getTime()) / 60000) > 5) {

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
}

const daemon2Interval = setInterval(daemon2, 500)

//Daemons Ended


let requestCounter = 0;

//Get Events
app.get("/api/events", (req, res) => {
    requestCounter+=1;
    //console.log(requestCounter + ' Request Received! (Events)');
    Events.find((err, events)=>{
        if(err){
            res.status(400).send(err);
        }else{
            res.status(200).json(events);
            console.log( requestCounter + ' Request Satisfied (Events Sent!)')
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
