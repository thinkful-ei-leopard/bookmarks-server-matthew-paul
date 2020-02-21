const app = require('../src/app');
const { API_TOKEN } = require('../src/config');

describe('App', () => {
  it('GET /bookmarks no auth responds with 401 unauthorized', () => {
    return supertest(app)
      .get('/bookmarks')
      .expect(401, {
        error: 'Unauthorized request'
      })
  })

  it('GET /bookmarks with auth responds with 200 and array of bookmarks', () => {
    return supertest(app)
      .get('/bookmarks')
      .set('Authorization', 'Bearer ' + API_TOKEN)
      .expect(200, { 
        bookmarks: [
          {
            id: 1,
            title: 'test',
            description: 'test description',
            url: 'http://www.google.com',
            rating: 5
          }
        ]
       })
  });

  it('POST /bookmarks with auth responds with 201', () => {
    return supertest(app)
      .post('/bookmarks')
      .set('Authorization', 'Bearer ' + API_TOKEN)
      .set('Content-Type', 'application/json')
      .send({ 
        title: 'test2', 
        description: 'another test', 
        url: 'http://www.example.com', 
        rating: 3 
      })
      .expect(201);
  })

  it('GET /bookmarks/:id with auth responds with 200 bookmark object', () => {
    return supertest(app)
      .get('/bookmarks/1')
      .set('Authorization', 'Bearer ' + API_TOKEN)
      .expect(200, {
        id: 1,
        title: 'test',
        description: 'test description',
        url: 'http://www.google.com',
        rating: 5
      })
  });
  
  it('DELETE /bookmarks/:id with auth responds with 204', () => {
    return supertest(app)
    .delete('/bookmarks/1')
    .set('Authorization', 'Bearer ' + API_TOKEN)
    .expect(204)
  })
});