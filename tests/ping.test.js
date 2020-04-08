const request = require('supertest')
const { http } = require('../src/http')

test('Should test server connection', async () => {
    const res = await request(http)
        .get('/api/ping')
        .send()
        .expect(200)
        
    expect(res.text).toBe('pong')
})