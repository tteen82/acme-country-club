const { conn, syncAndSeed } = require('./db');
const express = require('express');
const app = express();
const pg = require('pg');
const routes = require('./routes');

app.use('/api', routes);

// app.get('/api/facilities', async (req, res, next) => {
//   try {
//     const facilities = await Facilities.findAll({
//       include: [Bookings],
//     });
//     res.send(facilities);
//   } catch (ex) {
//     next(ex);
//   }
// });

// app.get('/api/bookings', async (req, res, next) => {
//   try {
//     const bookings = await Bookings.findAll({
//       include: [{ model: Members, as: 'Booker' }],
//     });
//     res.send(bookings);
//   } catch (ex) {
//     next(ex);
//   }
// });

// app.get('/api/members', async (req, res, next) => {
//   try {
//     const members = await Members.findAll({
//       include: [
//         { model: Members, as: 'sponsee' },
//         { model: Members, as: 'sponsor' },
//       ],
//     });
//     res.send(members);
//   } catch (ex) {
//     next(ex);
//   }
// });

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port(${port})`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
