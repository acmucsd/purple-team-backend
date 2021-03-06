//dependencies
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Event } = require('../database/models/eventsModel');
const request = require('supertest');
const dbHandler = require('./db-handler');
const app = require('../app');
const ObjectId = require('mongodb').ObjectID;

//const mongod = new MongoMemoryServer();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

//const mongoose = require('mongoose');

let db;

const mockEvent = new Event({
  title: 'watch garrett chug ketchup',
  location: "Garrett's House",
  startTime: new Date(2020, 5, 25, 15, 0, 0, 0),
  endTime: new Date(2020, 5, 25, 17, 0, 0, 0),
  checkIn: 'ketchupChug',
  tags: ['Social', 'Garrett'],
  url: 'google.com'
});

const mockEvent2 = new Event({
  title: 'building a cat cafe with stanley',
  location: 'qualcomm room',
  startTime: new Date(2020, 5, 15, 12, 0, 0, 0),
  endTime: new Date(2020, 5, 15, 15, 0, 0, 0),
  checkIn: 'snuCafe',
  tags: ['Social', 'Stanley'],
  url: 'roblox.com'
});

const mockEvent3 = new Event({
  title: 'worship Brian the jest god',
  location: 'church',
  startTime: new Date(2020, 10, 15, 12, 0, 0, 0),
  endTime: new Date(2020, 10, 15, 15, 0, 0, 0),
  checkIn: 'jestgod',
  tags: ['Religion', 'Cult'],
  url: 'brian.com'
});

const mockEvent4 = new Event({
  title: 'make TikToks that actually go viral',
  location: 'UCSD',
  startTime: new Date(2020, 1, 15, 12, 0, 0, 0),
  endTime: new Date(2020, 1, 15, 15, 0, 0, 0),
  checkIn: 'tiktok',
  tags: ['Depression', 'Social'],
  url: 'tiktok.com'
});

const mockEvent5 = new Event({
  title: 'one match of acm 5v5 league',
  location: 'the rift',
  startTime: new Date(2020, 2, 15, 12, 0, 0, 0),
  endTime: new Date(2020, 2, 15, 15, 0, 0, 0),
  checkIn: 'yuumi',
  tags: ['Cult', 'Joke'],
  url: 'whatssleepschedule.com'
});

describe('routes', () => {
  afterEach(async () => {
    await dbHandler.clearDatabase();
    //await db.collection('events').deleteMany({});
  });

  beforeAll(async () => {
    db = await dbHandler.connect();

    /*const uri = await mongod.getUri();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();

    try {
      await mongoose.connect(uri, {
        useNewUrlParser:true,
        useUnifiedTopology: true
      })
      .then(() => console.log("connected to test mongo database"))
    }
    catch (error) {
        console.log(error);
    }
    db = await mongoose.connection*/
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
    /*await mongoose.disconnect();
    await mongod.stop();
    await db.close();*/
  });

  test('It should response the GET method at root', async done => {
    request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          message: 'Welcome to the ACM Backend Server'
        });
        done();
      });
  });

  test('test posting an event to /events/event', async () => {
    //const events = db.collection('events');
    const response = await request(app)
      .post('/events/event')
      .send(mockEvent)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const events = db.collections['events'];

    const getRes = await request(app)
      .get('/events/event/id')
      .send({ _id: ObjectId(response.body._id) })
      .set('Accept', 'application/json');
    const localFind = await events
      .find({ _id: ObjectId(response.body._id) })
      .next();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(getRes.body[0]);
  });

  test('test getting two events from /events/event', async () => {
    //const events = db.collection('events');
    const response = await request(app)
      .post('/events/event')
      .send(mockEvent)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response2 = await request(app)
      .post('/events/event')
      .send(mockEvent2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const events = db.collections['events'];

    const getRes = await request(app)
      .get('/events/event/')
      .set('Accept', 'application/json');

    const jsonArr = [response.body, response2.body];

    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(getRes.statusCode).toBe(200);
    expect(jsonArr).toEqual(getRes.body);
    expect(getRes.body.length).toEqual(2);
  });

  test('test getting all from /events/event', async () => {
    //const events = db.collection('events');
    const response = await request(app)
      .post('/events/event')
      .send(mockEvent)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response2 = await request(app)
      .post('/events/event')
      .send(mockEvent2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const events = db.collections['events'];

    const getRes = await request(app)
      .get('/events/event/')
      .set('Accept', 'application/json');

    const jsonArr = [response.body, response2.body];

    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(getRes.statusCode).toBe(200);
    expect(jsonArr).toEqual(getRes.body);
  });

  test('test getting events with Social tag from /events/event', async () => {
    //const events = db.collection('events');
    const response = await request(app)
      .post('/events/event')
      .send(mockEvent)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response2 = await request(app)
      .post('/events/event')
      .send(mockEvent2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response3 = await request(app)
      .post('/events/event')
      .send(mockEvent3)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response4 = await request(app)
      .post('/events/event')
      .send(mockEvent4)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response5 = await request(app)
      .post('/events/event')
      .send(mockEvent5)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const events = db.collections['events'];

    const getRes = await request(app)
      .get('/events/event/Social')
      .set('Accept', 'application/json');

    const jsonArr = [response.body, response2.body, response4.body];

    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(response3.statusCode).toBe(200);
    expect(response4.statusCode).toBe(200);
    expect(response5.statusCode).toBe(200);
    expect(getRes.statusCode).toBe(200);
    expect(jsonArr).toEqual(getRes.body);
  });

  test('test getting events with Cult tag from /events/event', async () => {
    //const events = db.collection('events');
    const response = await request(app)
      .post('/events/event')
      .send(mockEvent)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response2 = await request(app)
      .post('/events/event')
      .send(mockEvent2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response3 = await request(app)
      .post('/events/event')
      .send(mockEvent3)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response4 = await request(app)
      .post('/events/event')
      .send(mockEvent4)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const response5 = await request(app)
      .post('/events/event')
      .send(mockEvent5)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const events = db.collections['events'];

    const getRes = await request(app)
      .get('/events/event/Cult')
      .set('Accept', 'application/json');

    const jsonArr = [response3.body, response5.body];

    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(response3.statusCode).toBe(200);
    expect(response4.statusCode).toBe(200);
    expect(response5.statusCode).toBe(200);
    expect(getRes.statusCode).toBe(200);
    expect(jsonArr).toEqual(getRes.body);
  });

  test('should DELETE an event through /events/event', async () => {
    //const events = db.collection('events');
    const response = await request(app)
      .post('/events/event')
      .send(mockEvent)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const deleteRes = await request(app)
      .delete('/events/event')
      .send({ _id: ObjectId(response.body._id) })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const getRes = await request(app)
      .get('/events/event/')
      .set('Accept', 'application/json');

    const jsonArr = [];

    expect(response.statusCode).toBe(200);
    expect(deleteRes.statusCode).toBe(200);
    expect(getRes.statusCode).toBe(200);
    expect(jsonArr).toEqual(getRes.body);
    expect(getRes.body.length).toEqual(0);
    expect(deleteRes.body).toEqual({ msg: 'Event deleted' });
  });
});

//set up text index for collection "events," allowing for keyword search
