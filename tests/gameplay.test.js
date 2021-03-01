const request = require('supertest');
const { http } = require('../src/http');
const { Party } = require('../src/models/party');
const { Player } = require('../src/models/player');
const { setupPlayPartyDb } = require('./database/setup');
const { userOne, userTwo, userThree } = require('./database/users');
const { playPartyId } = require('./database/parties');
const { playerOne, playerTwo, playerThree } = require('./database/players');

beforeAll(setupPlayPartyDb);

test('Should simulate complete game', async () => {
  // Cop Investigates Mafia:
  await request(http)
    .post(`/api/events/${playPartyId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      playerId: playerOne._id,
      targetId: playerThree._id,
      action: 'investigate',
    })
    .expect(201);

  let updatedPlayerOne = await Player.findById(playerOne._id);
  expect(updatedPlayerOne.isDone).toBe(true);
  expect(updatedPlayerOne.skills.get('investigate')).toBe(true);
  expect(updatedPlayerOne.log[3]['event'].includes('mafia')).toBe(true);

  // Medic heals himself
  await request(http)
    .post(`/api/events/${playPartyId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      playerId: playerTwo._id,
      targetId: playerTwo._id,
      action: 'heal',
    })
    .expect(201);

  let updatedPlayerTwo = await Player.findById(playerTwo._id);
  expect(updatedPlayerTwo.isDone).toBe(true);
  expect(updatedPlayerTwo.skills.get('heal')).toBe(true);
  expect(updatedPlayerTwo.wasHealed).toBe(true);

  // Leader Mafia shoots cop
  await request(http)
    .post(`/api/events/${playPartyId}`)
    .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
    .send({
      playerId: playerThree._id,
      targetId: playerOne._id,
      action: 'shoot',
    })
    .expect(201);
  // Cant test Mafia becase role was reinitialized

  // Test party attributes
  let updatedParty = await Party.findById(playPartyId);
  expect(updatedParty.instance).toBe('day');
  expect(updatedParty.liveCivilians).toBe(1);

  // Medic votes himself
  await request(http)
    .post(`/api/events/${playPartyId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      playerId: playerTwo._id,
      targetId: playerTwo._id,
      action: 'vote',
    })
    .expect(201);

  updatedPlayerTwo = await Player.findById(playerTwo._id);
  expect(updatedPlayerTwo.isDone).toBe(true);
  expect(updatedPlayerTwo.skills.get('vote')).toBe(true);
  expect(updatedPlayerTwo.numberOfVotes).toBe(1);

  // Leader Mafia votes medic
  await request(http)
    .post(`/api/events/${playPartyId}`)
    .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
    .send({
      playerId: playerThree._id,
      targetId: playerTwo._id,
      action: 'vote',
    })
    .expect(201);
  // Cant test Mafia becase role was reinitialized

  // Test party attributes
  updatedParty = await Party.findById(playPartyId);
  expect(updatedParty.status).toBe('finished');
  expect(updatedParty.liveCivilians).toBe(0);
  expect(updatedParty.won).toBe('mafia');
});
