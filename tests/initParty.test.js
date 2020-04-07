const request = require('supertest')
const http = require('../src/http')
const { setupInitPartyDb } = require('./database/setup')
const { initPartyId } = require('./database/parties')
const { Party } = require('../src/models/party')
const { userOne, userTwo, userThree } = require('./database/users')

beforeAll(setupInitPartyDb)

test('Should assign roles and initialize party', async () => {
    await request(http)
        .post(`/api/players/${initPartyId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(201)

    await request(http)
        .post(`/api/players/${initPartyId}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(201)

    await request(http)
        .post(`/api/players/${initPartyId}`)
        .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
        .send()
        .expect(201)

    const party = await Party.findById(initPartyId)
    expect(party.status).toBe('playing')
    expect(party.roles).toHaveLength(0)
})