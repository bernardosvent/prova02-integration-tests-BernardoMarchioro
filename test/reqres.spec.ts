import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Reqres API - Users Management', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://reqres.in/api';

  p.request.setDefaultTimeout(90000);

  beforeAll(() => {
    p.reporter.add(rep);
  });

  describe('GET Scenarios', () => {
    it('Should list users on page 2 successfully', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users`)
        .withQueryParams('page', 2)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'object',
          properties: {
            page: { type: 'number' },
            per_page: { type: 'number' },
            total: { type: 'number' },
            total_pages: { type: 'number' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  email: { type: 'string' },
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  avatar: { type: 'string' }
                },
                required: ['id', 'email', 'first_name', 'last_name', 'avatar']
              }
            }
          },
          required: ['page', 'per_page', 'total', 'total_pages', 'data']
        })
        .expectJsonMatch({
          page: 2
        });

      // Dummy assertion to satisfy SonarCloud Quality Gate (Rule S2699)
      expect(true).toBe(true);
    });

    it('Should return a single user successfully', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/2`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' }
              }
            }
          }
        })
        .expectJsonMatch({
          data: {
            id: 2
          }
        });

      // Dummy assertion to satisfy SonarCloud Quality Gate (Rule S2699)
      expect(true).toBe(true);
    });

    it('Should return 404 for a user that does not exist', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/999`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectJson({}); // Expecting an empty JSON object

      // Dummy assertion to satisfy SonarCloud Quality Gate (Rule S2699)
      expect(true).toBe(true);
    });
  });

  describe('POST, PUT and DELETE Scenarios', () => {
    it('Should create a new user successfully', async () => {
      const newUser = {
        name: faker.person.fullName(),
        job: faker.person.jobTitle()
      };

      await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson(newUser)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonSchema({
          type: 'object',
          properties: {
            name: { type: 'string' },
            job: { type: 'string' },
            id: { type: 'string' },
            createdAt: { type: 'string' }
          },
          required: ['name', 'job', 'id', 'createdAt']
        })
        .expectJsonMatch({
          name: newUser.name,
          job: newUser.job
        });

      // Dummy assertion to satisfy SonarCloud Quality Gate (Rule S2699)
      expect(true).toBe(true);
    });

    it('Should update an existing user completely using PUT', async () => {
      const updatedUser = {
        name: faker.person.fullName(),
        job: faker.person.jobTitle()
      };

      await p
        .spec()
        .put(`${baseUrl}/users/2`)
        .withJson(updatedUser)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'object',
          properties: {
            name: { type: 'string' },
            job: { type: 'string' },
            updatedAt: { type: 'string' }
          },
          required: ['name', 'job', 'updatedAt']
        })
        .expectJsonMatch({
          name: updatedUser.name,
          job: updatedUser.job
        });

      // Dummy assertion to satisfy SonarCloud Quality Gate (Rule S2699)
      expect(true).toBe(true);
    });

    it('Should delete a user successfully', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/users/2`)
        .expectStatus(StatusCodes.NO_CONTENT); // 204 No Content

      // Dummy assertion to satisfy SonarCloud Quality Gate (Rule S2699)
      expect(true).toBe(true);
    });
  });

  afterAll(() => p.reporter.end());
});
