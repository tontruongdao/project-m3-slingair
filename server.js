'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid'); // Added to create random generated ID
const { flights } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations'); // Added reservation array to append new entry.

const PORT = process.env.PORT || 8000;

// Handlers
const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  console.log(allFlights);
  console.log('REAL FLIGHT: ', allFlights.includes(flightNumber));

  if (allFlights.includes(flightNumber)) {
    //console.log(flights[flightNumber]);
    //send all of the flight's data
    res.status(200).send(flights[flightNumber]);
  } else {
    res.status(400).send({ message: 'Flight not Found' });
  }
};

const handleHomepage = (req, res) => {
  const flightName = Object.keys(flights); // Returns the key value of the object flight
  res.render('./index', { flights: flightName });
  // Renders the EJS file information with the user input.
};

//
const handleConfirmed = (req, res) => {
  // res.send('confirmed');
  let info = req.params.id;
  console.log(info);
  let data = reservations.find((res) => res.id == info);
  console.log(data);
  res.status(200).render('confirmed', { flightInfo: data });
}; //

const handleViewReservation = (req, res) => {
  // res.send('view-reservation')
  res.render('view-reservation');
}; //

// Handlers

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/flights/:flightNumber', handleFlight)
  .get('/seat-select', handleHomepage) //

  .get('/users', function (req, res) {
    console.log('Sending INFO!!');
    res.status(200).send(reservations);
    console.log(reservations);
  }) // Returns

  // This posts the input from the form into the reservations potion.
  .post('/users', function (req, res) {
    let reqBody = req.body; // Post request
    let newid = uuidv4(); // Generated ID
    let resId = { id: uuidv4() }; // New object created from ID
    // console.log('Post Request Received');
    // console.log('Info Received is:', reqBody);
    // console.log('This is the ID given to new Reservation:', resId);
    //let newData = { ...resId, ...reqBody };
    // This method is perfectly fine also.
    let data = reqBody;
    data.id = uuidv4(); // Appended ID to object from POST request
    // console.log(data);
    // console.log('Completed Form:', newData);
    // Verify newly created object.
    //* We need to also change the availability.

    reservations.push(data);
    console.log(reservations);

    // Code to update seating for the new confirmed reservation.
    const chosenSeat = flights[data.flight].find(
      (seat) => seat.id === data.seat
    );
    // returns item in the array from "flightSeatings.js"
    chosenSeat.isAvailable = false;
    //

    res.status(200).send('Post request received');
    // This portion pushes data from form to the imported reservations.
  })

  .get('/seat-select/confirmed/:id', handleConfirmed) // The ":id" is the variable  we used to have a unique endpoint for each entry
  .get('/view-reservation', handleViewReservation) //
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
