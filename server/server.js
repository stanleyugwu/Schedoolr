const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
con.once('open',()=>{console.log("Server has established connection to database:",database)});

//Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//Send Email
function sendMail(data){
    console.log('Sent');
}

//Daemon 1 (Background Process for tracking events time and sending reminder emails)
setInterval(function () {

    const date = new Date().getTime();//get Current Date

    Events.find((err, events) => {

        if (err) {
            console.log('Error Accessing Table')
        }

        events.map((event) => {

            const remainingTime = Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / 60000); //Calculate Remaining Minutes Before Event Starts
            
            if (remainingTime > 0 && remainingTime <= 10/*notification time*/ && event.notificationEmail && !event.notified) {
                console.log(remainingTime)

                sendMail(event);//Send Email

                event.notified = true;//mark event as notified

                //Save back event
                event.save(function(err, res){
                    if(err){console.log(err)}
                });
                
            } else if (remainingTime > 0 && remainingTime <= 10/*notification time*/ && !!event.notificationEmail && !event.notified) {
                event.notified = true;
                event.save(function (err, res) {
                    if (err) { console.log(err) }
                })
                
            }
        });
    });
}, 2000);


//Daemon 2
setInterval(function(){
    Events.find((err, events) => {
        if(err){console.log('Error Accessing Table')}
        else{
            events.map((event)=>{
                if(new Date(event.startDate).getTime() <= date/* || Math.ceil(((event.startDate - date) /1000)) <= 5 */){
                    console.log('Event reached');
                    sendMail();
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


var requestCounter = 0;

//Get Events
app.get("/api/events", (req, res) => {
    requestCounter+=1;
    console.log('Request Recieved!! ' + requestCounter);
    Events.find((err, events)=>{
        if(err){res.status(400).send(err)}else{res.json(events)}
    })
});

//Get Single event
app.get("/api/get/:id", (req, res) => {
    var id = req.params.id;
    var data = req.body;
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
    var event = new Events(req.body);
    event.save().then(event => {
        res.status(200).json({'status':'Added successfully!',"Added:":event})
    }).catch(err => {
        res.status(400).json({"Status":"Not Added","Error":err.message})
        console.log(err)
    });
});

//Delete event
app.delete("/api/delete/:id", (req, res) => {
    var id = req.params.id;
    Events.deleteOne({ _id: new mongoose.Types.ObjectId(id) }, function (err, results) {
        if(err){res.status(400).json({"status":"NOT! Deleted","error":err})}else{res.send('Deleted Successfully!')}
    });
});


//Update event
app.put("/api/modify/:id", (req, res) => {
    var id = req.params.id;
    var data = req.body;
    Events.findOneAndUpdate({_id:id}, data, {'useFindAndModify': false}, (err, doc)=>{
        if(err){
            res.status(400).json({"status":"MODIFICATION FAILED!!","Error":err})
    }else{
        res.status(200).json({"Status":"Update Successful","Data":doc})
    }
    })
});


app.listen(PORT, ()=>{console.log('Server Started Successfully!!','\nRunning On Port :'+PORT)})