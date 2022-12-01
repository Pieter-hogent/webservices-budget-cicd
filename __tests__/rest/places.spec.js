const { withServer } = require('../helpers');
const { tables } = require('../../src/data');

const data = {
  places: [{
    id: 1,
    name: 'Loon',
    rating: 5,
  },
  {
    id: 2,
    name: 'Benzine',
    rating: 2,
  },
  {
    id: 3,
    name: 'Irish pub',
    rating: 4,
  },
  ],
};

const dataToDelete = {
  places: [
    1,
    2,
    3,
  ],
};

describe('Places', () => {
  let request;
  let knex;
  let authHeader;

  withServer(({ knex: k, request: r, authHeader: a }) => {
    knex = k;
    request = r;
    authHeader = a;
  });

  const url = '/api/places';

  describe('GET /api/places', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
    });

    afterAll(async () => {
      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();
    });

    test('it should 200 and return all places', async () => {
      const response = await request.get(url)
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      // one place from transactions could be present due to Jest running all tests parallel
      // so check at least 3 places exist
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(response.body.items.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /api/places/:id', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places[0]);
    });

    afterAll(async () => {
      await knex(tables.place)
        .where('id', data.places[0].id)
        .delete();
    });

    test('it should 200 and return the requested place', async () => {
      const response = await request.get(`${url}/${data.places[0].id}`)
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(data.places[0]);
    });
  });

  describe('POST /api/places', () => {

    const placesToDelete = [];

    afterAll(async () => {
      await knex(tables.place)
        .whereIn('id', placesToDelete)
        .delete();
    });

    test('it should 201 and return the created place', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          name: 'New place',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('New place');
      expect(response.body.rating).toBeNull();

      placesToDelete.push(response.body.id);
    });

    test('it should 201 and return the created place with it\'s rating', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          name: 'Lovely place',
          rating: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Lovely place');
      expect(response.body.rating).toBe(5);

      placesToDelete.push(response.body.id);
    });
  });

  describe('PUT /api/places/:id', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
    });

    afterAll(async () => {
      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();
    });

    test('it should 200 and return the updated place', async () => {
      const response = await request.put(`${url}/${data.places[0].id}`)
        .set('Authorization', authHeader)
        .send({
          name: 'Changed name',
          rating: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: data.places[0].id,
        name: 'Changed name',
        rating: 1,
      });
    });
  });

  describe('DELETE /api/places/:id', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places[0]);
    });

    test('it should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/${data.places[0].id}`)
        .set('Authorization', authHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});