const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');

let selection = '';

const renderSeats = (data) => {
  // console.log(data);
  document.querySelector('.form-container').style.display = 'block';

  const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement('ol');
    row.classList.add('row');
    row.classList.add('fuselage');
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement('li');

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      let seatData = data.find((item) => item.id == seatNumber);
      /* This uses the fetched "data" from data function in line 52.
      The find method will return the first item in the data array, in the case it is the array.
      */
      // console.log(seatData);
      if (seatData.isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      // Used some logic to verify if the seat is occupied from the data fetched.
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
        }
      });
      document.getElementById(seat.value).classList.add('selected');
      document.getElementById('seat-number').innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  // Added flightInput.onchange
  const flightNumber = flightInput.value;
  console.log('toggleFormContent: ', flightNumber);
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      renderSeats(data); // Moved the renderSeats(data) within the pair brackets "})"
    });
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
  document.getElementById('seats-section').innerHTML = ''; // This removes the previous flight seat-section
};

const inputName = document.getElementById('givenName'); // To select DOM element
const inputSurname = document.getElementById('surname'); // To select DOM element
const inputEmail = document.getElementById('email'); // To select DOM element

const postData = async () => {
  let rp = await fetch('/users', {
    method: 'POST',
    body: JSON.stringify({
      flight: flightInput.value, // Include in "body" JSON to match object in reservation.js
      seat: selection, // Include in "body" JSON to match object in reservation.js
      givenName: document.getElementById('givenName').value, // Already there
      surname: inputSurname.value, // Added to post Surname
      email: inputEmail.value, // Added to Post Email
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return rp;
}; // This uses the POST endpoint to post the input throught promises.

const getData = async () => {
  let rp = await fetch('/users', {
    method: 'GET',
  });
  return rp;
}; // This uses the GET end point to get the imput from the endpoint throught promises

const handleConfirmSeat = (event) => {
  event.preventDefault();
  // TODO: everything in here!
  // console.log(inputName.value, inputSurname.value, inputEmail.value);
  // console.log to confirmed the selected element and include in "fetch" request.
  postData();

  getData()
    .then((res) => res.json())
    .then((data) => {
      let client = data.find((item) => item.email == inputEmail.value);
      console.log('The client ID is', client.id);
      window.location = `/seat-select/confirmed/${client.id}`;
      // Redirects to the confirmed endpoint with the client's ID as a variable.
    });

  // return getData().then((res) => console.log(res));
  // fetch('/users', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     flight: flightInput.value, // Include in "body" JSON to match object in reservation.js
  //     seat: selection, // Include in "body" JSON to match object in reservation.js
  //     givenName: document.getElementById('givenName').value, // Already there
  //     surname: inputSurname.value, // Added to post Surname
  //     email: inputEmail.value, // Added to Post Email
  //   }),
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  // });
};

// Function used to POST and GET fetch data from the form.

flightInput.addEventListener('blur', toggleFormContent);
