import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUsersService = {
  findOne: (id: number) => {
    return Promise.resolve({ id, email: 'x@x.com', password: 'asdf' } as User);
  },
  find: (email: string) => {
    return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
  },
  // remove: () => {},
  // update: () => {},
};

const mockAuthService = {
  signUp: (email: string, password: string) => {
    return Promise.resolve({ id: 1, email, password } as User);
  },
  signIn: (email: string, password: string) => {
    return Promise.resolve({ id: 1, email, password } as User);
  },
};

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: UsersService;
  let fakeAuthService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    fakeUsersService = module.get<UsersService>(UsersService);
    fakeAuthService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('x@x.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('x@x.com');
  });

  it('findUser returns a single user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: 1 };
    const user = await controller.signIn({ email: 'x@x.com', password: 'asdf' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('signUp creates a new user', async () => {
    const session = { userId: 1 };
    const user = await controller.createUser({ email: 'x@x.com', password: 'asdf' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  // it('signOut clears the session object', async () => {
  //   const session = { userId: 1 };
  //   controller.signOut(session);
  //   expect(session.userId).toBeUndefined();
  // });

});
