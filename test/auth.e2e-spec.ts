import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import * as pactum from 'pactum';
import { ClientsModule, Transport } from "@nestjs/microservices";

describe('Auth e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const email = 'msauter@test.com';
  const password = '12345';
  const signupRequest = {
    email,
    password
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'MAIL_SERVER',
            transport: Transport.TCP
          }
        ])
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));

    await app.init();
    await app.listen(3001);

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(() => {
    app.close();
  })

  // TODO: testing mailService
  describe('Signup', () => {
    it('should throw an error if email is empty', () => {
      return pactum.spec()
        .post('/signup')
        .withBody({
          password
        })
        .expectStatus(400);
    });

    it('should throw an error if password is empty', () => {
      return pactum.spec()
        .post('/signup')
        .withBody({
          email
        })
        .expectStatus(400);
    });

    it('should throw an error if body is empty', () => {
      return pactum.spec()
        .post('/signup')
        .expectStatus(400);
    });

    it('should signup', () => {
      return pactum.spec()
        .post('/signup')
        .withBody(signupRequest)
        .expectStatus(201);
    });
  });

  // TODO: confirmRegitration e2e test with mailServiceApi emailToken

  describe('Signin', () => {
    it('should throw an error if email is empty', () => {
      return pactum.spec()
        .post('/signin')
        .withBody({
          password
        })
        .expectStatus(400);
    });

    it('should throw an error if password is empty', () => {
      return pactum.spec()
        .post('/signin')
        .withBody({
          email
        })
        .expectStatus(400);
    });

    it('should throw an error if body is empty', () => {
      return pactum.spec()
        .post('/signin')
        .expectStatus(400);
    });

    it('should throw an error if email is wrong', () => {
      return pactum.spec()
        .post('/signin')
        .withBody({
          email: 'msauter@test-wrong.com',
          password
        })
        .expectStatus(404);
    });

    it('should throw an error if password is wrong', () => {
      return pactum.spec()
        .post('/signin')
        .withBody({
          email,
          password: 'wrong-password'
        })
        .expectStatus(403);
    });

    it('should signin', () => {
      return pactum.spec()
        .post('/signin')
        .withBody(signupRequest)
        .expectStatus(200)
        .stores('access_token', 'access_token')
        .stores('refresh_token', 'refresh_token');
    });
  });

  describe('GetUserByEmail', () => {
    it('should throw an error if email is empty', () => {
      return pactum.spec()
        .get('/user/')
        .withHeaders({
          Authorization: 'Bearer $S{access_token}'
        })
        .expectStatus(404);
    });

    it('should throw an error without access_token', () => {
      return pactum.spec()
        .get(`/user/${signupRequest.email}`)
        .expectStatus(401);
    });

    it('should throw an error with refresh_token instead of access_token', () => {
      return pactum.spec()
        .get(`/user/${signupRequest.email}`)
        .withHeaders({
          Authorization: `Bearer $S{refresh_token}`
        })
        .expectStatus(401);
    });

    it('should throw an error if no user was found with email', () => {
      return pactum.spec()
        .get('/user/no-user-with-email@test.com')
        .withHeaders({
          Authorization: 'Bearer $S{access_token}'
        })
        .expectStatus(404);
    });

    it(`should return user with the email: ${signupRequest.email}`, async () => {
      await pactum.spec()
        .get(`/user/${signupRequest.email}`)
        .withHeaders({
          Authorization: 'Bearer $S{access_token}'
        })
        .expectStatus(200)
        .expectBodyContains(signupRequest.email);
    });
  });

  describe('RefreshToken', () => {
    it('should throw an error without refresh_token', () => {
      return pactum.spec()
        .post('/refresh')
        .expectStatus(401);
    });

    it('should throw an error if access_token instead of refresh_token in header', () => {
      return pactum.spec()
        .post('/refresh')
        .withHeaders({
          Authorization: 'Bearer $S{access_token}'
        })
        .expectStatus(401);
    });

    it('should refresh token', () => {
      return pactum.spec()
        .post('/refresh')
        .withHeaders({
          Authorization: 'Bearer $S{refresh_token}'
        })
        .expectStatus(200);
    });
  })

  describe('Logout', () => {
    it('should throw an error without access_token', () => {
      return pactum.spec()
        .post('/logout')
        .expectStatus(401);
    });

    it('should throw an error if refresh_token instead of access_token in header', () => {
      return pactum.spec()
        .post('/logout')
        .withHeaders({
          Authorization: 'Bearer $S{refresh_token}'
        })
        .expectStatus(401);
    });

    it('should logout', () => {
      return pactum.spec()
        .post('/logout')
        .withHeaders({
          Authorization: 'Bearer $S{access_token}'
        })
        .expectStatus(200);
    });
  });

  describe('UpdateUserEmail', () => {
    const updatedEmail = 'msauter-updated@test.de';

    it('should throw an error without access_token', () => {
      return pactum.spec()
        .put('/user/email')
        .withBody({
          email: updatedEmail
        })
        .expectStatus(401);
    });

    it ('should throw an error if refresh_token instead of access_token in header', () => {
      return pactum.spec()
      .put('/user/email')
      .withHeaders({
        Authorization: 'Bearer $S{refresh_token}'
      })
      .withBody({
        email: updatedEmail
      })
      .expectStatus(401);
    });

    it('should throw an error if no email in body', () => {
      return pactum.spec()
        .put('/user/email')
        .withHeaders({
          Authorization: `Bearer $S{access_token}`
        })
        .expectStatus(400);
    });

    it('should update email', () => {
      pactum.spec()
        .put('/user/email')
        .withHeaders({
          Authorization: `Bearer $S{access_token}`
        })
        .withBody({
          email: updatedEmail
        })
        .expectStatus(200)
        .expectBodyContains(updatedEmail);
    });
  });

  describe('UpdateUserPassword', () => {
    const updatedPassword = 'updated-password';

    it('should throw an error without access_token', () => {
      return pactum.spec()
        .put('/user/password')
        .withBody({
          password: updatedPassword
        })
        .expectStatus(401);
    });

    it ('should throw an error if refresh_token instead of access_token in header', () => {
      return pactum.spec()
      .put('/user/password')
      .withHeaders({
        Authorization: 'Bearer $S{refresh_token}'
      })
      .withBody({
        password: updatedPassword
      })
      .expectStatus(401);
    });

    it('should throw an error if no email in body', () => {
      return pactum.spec()
        .put('/user/password')
        .withHeaders({
          Authorization: `Bearer $S{access_token}`
        })
        .expectStatus(400);
    });

    it('should update password', () => {
      return pactum.spec()
      .put('/user/password')
      .withHeaders({
        Authorization: 'Bearer $S{access_token}'
      })
      .withBody({
        password: updatedPassword
      })
      .expectStatus(200);
    });
  })

  describe('DeleteUser', () => {
    it('should throw an error without access_token', () => {
      return pactum.spec()
        .delete('/delete/1')
        .expectStatus(401);
    });

    it('should throw an error with refresh_token instead of access_token', () => {
      return pactum.spec()
        .delete('/delete/1')
        .withHeaders({
          Authorization: `Bearer $S{refresh_token}`
        })
        .expectStatus(401);
    });

    it('should throw an error without ADMIN role', () => {
      return pactum.spec()
        .delete('/delete/1')
        .withHeaders({
          Authorization: `Bearer $S{access_token}`
        })
        .expectStatus(401);
    });

    // TODO: Delete user and Delete user error tests
    /*it('should throw an error if delete user not found', () => {
      const login_as_admin = pactum.e2e('Login as admin');

      login_as_admin.step('Login as admin').spec()
        .post('/login')
        .withBody({
          email: 'msauter-admin@test.com',
          password
        })
        .stores('access_token', 'access_token_admin')
        .expectStatus(200)
        .clean()
        .delete('/delete/msauter-not-found@test.com')
        .withHeaders({
          Authorization: `Bearer $S{access_token_admin}`
        })
        .expectStatus(404);
    });

    it('should delete user', async () => {
      const login_as_admin = pactum.e2e('Login as admin');

      login_as_admin.step('Login as admin').spec()
        .post('/login')
        .withBody({
          email: 'msauter-admin@test.com',
          password
        })
        .stores('access_token', 'access_token_admin')
        .delete('/delete/100')
        .withHeaders({
          Authorization: `Bearer $S{access_token_admin}`
        })
        .expectStatus(200);
    });*/
  })

  describe('User logged out', () => {
    it('should throw an error if refresh token', () => {
      return pactum.spec()
        .post('/refresh')
        .withHeaders({
          Authorization: 'Bearer $S{refresh_token}'
        })
        .expectStatus(403);
    });
  })
});