const { STRING, TEXT } = require('sequelize');
const Sequelize = require('sequelize');
const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme-country-club-db'
);

const commonAttr = {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
};

const Members = conn.define('members', {
  ...commonAttr,
  name: {
    type: STRING(20),
  },
});

const Facilities = conn.define('facilities', {
  ...commonAttr,
  name: {
    type: STRING(20),
  },
});

const Bookings = conn.define('bookings', {
  ...commonAttr,
});

Members.belongsTo(Members, { as: 'sponsor' });
Members.hasMany(Members, { as: 'sponsee', foreignKey: 'sponsorId' });
Members.hasMany(Bookings);
Facilities.hasMany(Bookings);
Bookings.belongsTo(Members, { as: 'Booker' });
Bookings.belongsTo(Facilities);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, ethyl, larry] = await Promise.all(
    ['moe', 'lucy', 'ethyl', 'larry'].map((name) => Members.create({ name }))
  );
  const [tennis, pingpong, marbles] = await Promise.all(
    ['tennis', 'pingpong', 'marbles'].map((name) => Facilities.create({ name }))
  );

  moe.sponsorId = lucy.id;
  larry.sponsorId = lucy.id;
  ethyl.sponsorId = moe.id;

  await Promise.all([moe.save(), larry.save(), ethyl.save()]);

  await Promise.all([
    Bookings.create({ BookerId: lucy.id, facilityId: marbles.id }),
    Bookings.create({ BookerId: lucy.id, facilityId: marbles.id }),
    Bookings.create({ BookerId: moe.id, facilityId: tennis.id }),
  ]);
};

module.exports = {
  conn,
  syncAndSeed,
  Members,
  Facilities,
  Bookings,
};
