const confirmButton = document.getElementById('confirm-button');
const inputEmail = document.getElementById('email'); // To select DOM element

const getData = async () => {
  let rp = await fetch('/users', {
    method: 'GET',
  });
  return rp;
};

const handleReservation = (event) => {
  event.preventDefault();
  console.log(inputEmail.value);
  getData()
    .then((res) => res.json())
    .then((data) => {
      let client = data.find((item) => item.email == inputEmail.value);
      // Used DOM element value in find method
      console.log('The client ID is', client.id);
      window.location = `/seat-select/confirmed/${client.id}`;
      // Redirected to confirmation using find method.
    });
};
