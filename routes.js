const { Members, Facilities, Bookings } = require('./db');
const express = require('express');
const router = express.Router();

router.get('/facilities', async (req, res, next) => {
  try {
    const facilities = await Facilities.findAll({
      include: [Bookings],
    });
    res.send(facilities);
  } catch (ex) {
    next(ex);
  }
});

router.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await Bookings.findAll({
      include: [{ model: Members, as: 'Booker' }],
    });
    res.send(bookings);
  } catch (ex) {
    next(ex);
  }
});

router.get('/members', async (req, res, next) => {
  try {
    const members = await Members.findAll({
      include: [
        { model: Members, as: 'sponsee' },
        { model: Members, as: 'sponsor' },
      ],
    });
    res.send(members);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
