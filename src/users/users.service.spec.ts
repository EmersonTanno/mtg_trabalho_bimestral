import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const username = 'testUser';
      const password = 'testPassword';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('testSalt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      model.create.mockResolvedValue({ username, password: 'hashedPassword' });

      const result = await service.createUser(username, password);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'testSalt');
      expect(model.create).toHaveBeenCalledWith({
        username,
        password: 'hashedPassword',
      });
      expect(result).toEqual({ username, password: 'hashedPassword' });
    });
  });

  describe('findOne', () => {
    it('should find one user by username', async () => {
      const username = 'testUser';
      const expectedUser = { username, password: 'hashedPassword' };

      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(expectedUser),
      });

      const result = await service.findOne(username);

      expect(model.findOne).toHaveBeenCalledWith({ username });
      expect(result).toEqual(expectedUser);
    });
  });
});
