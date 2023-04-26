import express from 'express';

const app = express();
const port = process.env.PORT || 80;

const base_url = 'https://api.openrouteservice.org/v2/directions/driving-car';
const key = process.env.key;

function direction(from, to) {
  return `${base_url}?api_key=${key}&start=${from.join(',')}&end=${to.join(',')}`;
}

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
});


app.get('/directions', (req, res) => {
  const [lat1, lon1] = req.query.start.split(',').map(parseFloat);
  const nEnd = parseInt(req.query.nend ?? 1);
  const ends = [...new Array(nEnd)]
    .map((_, i) => req.query['end' + i].split(',').map(parseFloat));

  if (!ends.every(d => d.length === 2 && !Number.isNaN(d[0]) && !Number.isNaN(d[1]))) {
    throw new Error('invalid ends: ' + ends.toString());
  }

  Promise.all([...new Array(nEnd)]
    .map((_, i) => req.query['end' + i].split(',').map(parseFloat))
    .map(([lat2, lon2]) =>
      fetch(direction([lon1, lat1], [lon2, lat2]))
        .then(response => response.json())
    )
  ).then(jsons => res.json(jsons));

})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});