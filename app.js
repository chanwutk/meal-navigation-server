import express from 'express';

const app = express();
const port = process.env.PORT || 80;

const base_url = 'https://api.openrouteservice.org/v2/directions/driving-car';
const key = process.env.key;

function direction(from, to) {
  return `${base_url}?api_key=${key}&start=${from.join(',')}&end=${to.join(',')}`;
}

app.get('/directions', (req, res) => {
  const [lat1, lon1] = req.query.start.split(',').map(parseFloat);
  const [lat2, lon2] = req.query.end.split(',').map(parseFloat);

  fetch(direction([lon1, lat1], [lon2, lat2]))
    .then(response => response.json())
    .then(jsonData => res.send(jsonData));
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});