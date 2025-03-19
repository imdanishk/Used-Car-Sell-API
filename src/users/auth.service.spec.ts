import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter((user) => user.email === email);
                return Promise.resolve(filteredUsers);
            }, 
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signUp('XhVb3@example.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws error if user signs up with email that is in use', async () => {
        await service.signUp('XhVb3@example.com', 'asdf');
        await expect(service.signUp('XhVb3@example.com', 'asdf')).rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signIn('XhVb3@example.com', 'asdf')).rejects.toThrow(UnauthorizedException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signUp('XhVb3@example.com', 'asdf');
        await expect(service.signIn('XhVb3@example.com', 'xccxx')).rejects.toThrow(UnauthorizedException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signUp('XhVb3@example.com', 'asdf');
        const user = await service.signIn('XhVb3@example.com', 'asdf');
        expect(user).toBeDefined();
    });
});