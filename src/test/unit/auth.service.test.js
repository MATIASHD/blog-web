import { describe, test, expect, vi, beforeEach } from 'vitest';
const { AuthService } = require('../../services/auth.service');
const userRepository = require('../../repositories/user.repository');
const jwtService = require('../../services/jwt.service');

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    vi.restoreAllMocks();
    authService = new AuthService();
  });

  describe('login', () => {
    test('should login user successfully with valid credentials', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', is_active: true, role: 'admin' };
      const req = { ip: '127.0.0.1', headers: { 'user-agent': 'test-agent' } };

      const getByEmailSpy = vi.spyOn(userRepository, 'getByEmail').mockResolvedValue(mockUser);
      const verifyPasswordSpy = vi.spyOn(userRepository, 'verifyPassword').mockResolvedValue(true);
      const saveSpy = vi.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      const generateAccessTokenSpy = vi.spyOn(jwtService, 'generateAccessToken').mockReturnValue('access-token');
      const generateRefreshTokenSpy = vi.spyOn(jwtService, 'generateRefreshToken').mockReturnValue({ token: 'refresh-token', jti: 'jti-1' });
      const createSessionSpy = vi.spyOn(jwtService, 'createSession').mockResolvedValue({});

      const result = await authService.login('test@example.com', 'password123', req);

      expect(getByEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(verifyPasswordSpy).toHaveBeenCalledWith(mockUser, 'password123');
      expect(saveSpy).toHaveBeenCalled();
      expect(generateAccessTokenSpy).toHaveBeenCalledWith(mockUser);
      expect(createSessionSpy).toHaveBeenCalledWith('user-1', '127.0.0.1', 'test-agent', 'jti-1');
      expect(result).toEqual({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    test('should throw error if user not found', async () => {
      const getByEmailSpy = vi.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);
      const req = { ip: '127.0.0.1', headers: {} };

      await expect(authService.login('wrong@example.com', 'password123', req))
        .rejects.toThrow('Invalid email or password');

      expect(getByEmailSpy).toHaveBeenCalledWith('wrong@example.com');
    });

    test('should throw error if password verification fails', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', is_active: true };
      const getByEmailSpy = vi.spyOn(userRepository, 'getByEmail').mockResolvedValue(mockUser);
      const verifyPasswordSpy = vi.spyOn(userRepository, 'verifyPassword').mockResolvedValue(false);
      const req = { ip: '127.0.0.1', headers: {} };

      await expect(authService.login('test@example.com', 'wrongpassword', req))
        .rejects.toThrow('Invalid email or password');

      expect(getByEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(verifyPasswordSpy).toHaveBeenCalledWith(mockUser, 'wrongpassword');
    });

    test('should throw error if user account is disabled', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', is_active: false };
      const getByEmailSpy = vi.spyOn(userRepository, 'getByEmail').mockResolvedValue(mockUser);
      const verifyPasswordSpy = vi.spyOn(userRepository, 'verifyPassword').mockResolvedValue(true);
      const req = { ip: '127.0.0.1', headers: {} };

      await expect(authService.login('test@example.com', 'password123', req))
        .rejects.toThrow('Account is disabled');

      expect(getByEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(verifyPasswordSpy).toHaveBeenCalledWith(mockUser, 'password123');
    });
  });

  describe('register', () => {
    test('should register a new user successfully', async () => {
      const getByEmailSpy = vi.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);
      const saveSpy = vi.spyOn(userRepository, 'save').mockResolvedValue({ id: 'new-user', email: 'new@example.com', role: 'reader' });

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      });

      expect(getByEmailSpy).toHaveBeenCalledWith('new@example.com');
      expect(saveSpy).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'reader',
        is_active: true,
      });
      expect(result.id).toBe('new-user');
    });

    test('should throw error if email is already registered', async () => {
      const getByEmailSpy = vi.spyOn(userRepository, 'getByEmail').mockResolvedValue({ id: 'existing' });

      await expect(authService.register({ email: 'existing@example.com' }))
        .rejects.toThrow('Email already registered');

      expect(getByEmailSpy).toHaveBeenCalledWith('existing@example.com');
    });
  });
});
