import { describe, it, expect, beforeEach, afterEach, vi, MockedFunction } from 'vitest';
import { TokenController } from '../token-controller';
import { Database } from '@tachybase/database';
import { Cache } from '@tachybase/cache';
import { Logger } from '@tachybase/logger';

// Mock external dependencies
vi.mock('@tachybase/database');
vi.mock('@tachybase/cache');
vi.mock('@tachybase/logger');

const mockDatabase = vi.mocked(Database);
const mockCache = vi.mocked(Cache);
const mockLogger = vi.mocked(Logger);

interface UserPayload {
  id: string;
  email?: string;
  role?: string;
  permissions?: string[];
}

interface TokenValidationResult {
  valid: boolean;
  payload?: UserPayload;
  error?: string;
  expired?: boolean;
}

describe('TokenController', () => {
  let tokenController: TokenController;
  let mockDb: any;
  let mockCacheInstance: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup mock instances
    mockDb = {
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
    };

    mockCacheInstance = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      flushall: vi.fn(),
    };

    mockDatabase.mockImplementation(() => mockDb);
    mockCache.mockImplementation(() => mockCacheInstance);

    tokenController = new TokenController({
      database: mockDb,
      cache: mockCacheInstance,
      logger: mockLogger,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token for valid user data', async () => {
      const userData: UserPayload = {
        id: 'user123',
        email: 'test@example.com',
        role: 'admin',
      };

      const token = await tokenController.generateToken(userData);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should throw error for null user data', async () => {
      await expect(tokenController.generateToken(null as any)).rejects.toThrow('USER_DATA_REQUIRED');
    });

    it('should throw error for undefined user data', async () => {
      await expect(tokenController.generateToken(undefined as any)).rejects.toThrow('USER_DATA_REQUIRED');
    });

    it('should throw error for user data without id', async () => {
      const invalidData = { email: 'test@example.com' } as any;
      await expect(tokenController.generateToken(invalidData)).rejects.toThrow('USER_ID_REQUIRED');
    });

    it('should handle user data with special characters', async () => {
      const userData: UserPayload = {
        id: 'user-with-special_chars@123',
        email: 'test+tag@example.com',
        role: 'admin/supervisor',
      };

      const token = await tokenController.generateToken(userData);
      expect(token).toBeDefined();
    });

    it('should generate unique tokens for different users', async () => {
      const user1: UserPayload = { id: 'user1', email: 'user1@example.com' };
      const user2: UserPayload = { id: 'user2', email: 'user2@example.com' };

      const token1 = await tokenController.generateToken(user1);
      const token2 = await tokenController.generateToken(user2);

      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens for same user at different times', async () => {
      const userData: UserPayload = { id: 'user123', email: 'test@example.com' };

      const token1 = await tokenController.generateToken(userData);
      await new Promise(resolve => setTimeout(resolve, 1)); // Small delay
      const token2 = await tokenController.generateToken(userData);

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateToken', () => {
    let validToken: string;
    const userData: UserPayload = { id: 'user123', email: 'test@example.com', role: 'admin' };

    beforeEach(async () => {
      validToken = await tokenController.generateToken(userData);
    });

    it('should validate a valid token successfully', async () => {
      const result = await tokenController.validateToken(validToken);

      expect(result.valid).toBe(true);
      expect(result.payload).toMatchObject(userData);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty token', async () => {
      const result = await tokenController.validateToken('');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('TOKEN_REQUIRED');
    });

    it('should reject null token', async () => {
      const result = await tokenController.validateToken(null as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('TOKEN_REQUIRED');
    });

    it('should reject malformed token', async () => {
      const result = await tokenController.validateToken('invalid.token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('MALFORMED_TOKEN');
    });

    it('should reject token with invalid signature', async () => {
      const [header, payload] = validToken.split('.');
      const invalidToken = `${header}.${payload}.invalid_signature`;

      const result = await tokenController.validateToken(invalidToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_SIGNATURE');
    });

    it('should handle expired tokens', async () => {
      // Mock an expired token scenario
      const expiredToken = await tokenController.generateToken(userData, { expiresIn: '1ms' });
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for expiration

      const result = await tokenController.validateToken(expiredToken);

      expect(result.valid).toBe(false);
      expect(result.expired).toBe(true);
      expect(result.error).toBe('TOKEN_EXPIRED');
    });

    it('should handle blacklisted tokens', async () => {
      mockCacheInstance.get.mockResolvedValue('blacklisted');

      const result = await tokenController.validateToken(validToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('TOKEN_BLACKLISTED');
    });

    it('should fallback when cache is unavailable', async () => {
      mockCacheInstance.get.mockRejectedValue(new Error('Cache unavailable'));

      const result = await tokenController.validateToken(validToken);

      expect(result.valid).toBe(true); // Should still validate without cache
      expect(result.payload).toMatchObject(userData);
    });
  });

  describe('refreshToken', () => {
    let validToken: string;
    const userData: UserPayload = { id: 'user123', email: 'test@example.com', role: 'admin' };

    beforeEach(async () => {
      validToken = await tokenController.generateToken(userData);
    });

    it('should refresh a valid token successfully', async () => {
      const newToken = await tokenController.refreshToken(validToken);

      expect(newToken).toBeDefined();
      expect(typeof newToken).toBe('string');
      expect(newToken).not.toBe(validToken);

      // Verify new token is valid
      const validation = await tokenController.validateToken(newToken);
      expect(validation.valid).toBe(true);
      expect(validation.payload).toMatchObject(userData);
    });

    it('should reject refresh of invalid token', async () => {
      await expect(tokenController.refreshToken('invalid.token')).rejects.toThrow('INVALID_TOKEN');
    });

    it('should reject refresh of expired token', async () => {
      const expiredToken = await tokenController.generateToken(userData, { expiresIn: '1ms' });
      await new Promise(resolve => setTimeout(resolve, 10));

      await expect(tokenController.refreshToken(expiredToken)).rejects.toThrow('TOKEN_EXPIRED');
    });

    it('should blacklist old token after refresh', async () => {
      const newToken = await tokenController.refreshToken(validToken);

      expect(mockCacheInstance.set).toHaveBeenCalledWith(
        expect.stringContaining(validToken),
        'blacklisted',
        expect.any(Number)
      );
    });

    it('should handle refresh when cache is unavailable', async () => {
      mockCacheInstance.set.mockRejectedValue(new Error('Cache unavailable'));

      const newToken = await tokenController.refreshToken(validToken);
      expect(newToken).toBeDefined();
    });
  });

  describe('revokeToken', () => {
    let validToken: string;
    const userData: UserPayload = { id: 'user123', email: 'test@example.com' };

    beforeEach(async () => {
      validToken = await tokenController.generateToken(userData);
    });

    it('should revoke a valid token successfully', async () => {
      await tokenController.revokeToken(validToken);

      expect(mockCacheInstance.set).toHaveBeenCalledWith(
        expect.stringContaining(validToken),
        'blacklisted',
        expect.any(Number)
      );
    });

    it('should make revoked token invalid', async () => {
      await tokenController.revokeToken(validToken);
      mockCacheInstance.get.mockResolvedValue('blacklisted');

      const result = await tokenController.validateToken(validToken);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('TOKEN_BLACKLISTED');
    });

    it('should handle revocation of invalid token gracefully', async () => {
      await expect(tokenController.revokeToken('invalid.token')).rejects.toThrow('INVALID_TOKEN');
    });

    it('should handle cache failures during revocation', async () => {
      mockCacheInstance.set.mockRejectedValue(new Error('Cache unavailable'));

      await expect(tokenController.revokeToken(validToken)).rejects.toThrow('REVOCATION_FAILED');
    });
  });

  describe('concurrency and performance', () => {
    const userData: UserPayload = { id: 'user123', email: 'test@example.com' };

    it('should handle multiple simultaneous token generations', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        tokenController.generateToken({ ...userData, id: `user${i}` })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      expect(new Set(results).size).toBe(10); // All tokens should be unique
    });

    it('should handle rapid token validation requests', async () => {
      const token = await tokenController.generateToken(userData);
      const promises = Array.from({ length: 50 }, () =>
        tokenController.validateToken(token)
      );

      const results = await Promise.all(promises);
      results.forEach(result => {
        expect(result.valid).toBe(true);
      });
    });

    it('should generate tokens within acceptable time limits', async () => {
      const startTime = Date.now();
      await tokenController.generateToken(userData);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should validate tokens efficiently', async () => {
      const token = await tokenController.generateToken(userData);

      const startTime = Date.now();
      await tokenController.validateToken(token);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });
  });

  describe('integration workflows', () => {
    const userData: UserPayload = { id: 'user123', email: 'test@example.com', role: 'admin' };

    it('should complete full token lifecycle successfully', async () => {
      // Generate token
      const token = await tokenController.generateToken(userData);
      expect(token).toBeDefined();

      // Validate token
      const validation = await tokenController.validateToken(token);
      expect(validation.valid).toBe(true);
      expect(validation.payload).toMatchObject(userData);

      // Refresh token
      const newToken = await tokenController.refreshToken(token);
      expect(newToken).toBeDefined();
      expect(newToken).not.toBe(token);

      // Revoke new token
      await tokenController.revokeToken(newToken);
      mockCacheInstance.get.mockResolvedValue('blacklisted');

      const revokedValidation = await tokenController.validateToken(newToken);
      expect(revokedValidation.valid).toBe(false);
    });

    it('should handle database connection failures gracefully', async () => {
      mockDb.findOne.mockRejectedValue(new Error('Connection failed'));

      // Should still work if only using JWT validation without DB lookup
      const token = await tokenController.generateToken(userData);
      const result = await tokenController.validateToken(token);
      expect(result.valid).toBe(true);
    });

    it('should handle extremely large payloads', async () => {
      const largeUserData: UserPayload = {
        id: 'user123',
        email: 'test@example.com',
        permissions: Array.from({ length: 1000 }, (_, i) => `permission${i}`)
      };

      const token = await tokenController.generateToken(largeUserData);
      expect(token).toBeDefined();

      const validation = await tokenController.validateToken(token);
      expect(validation.valid).toBe(true);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle token with unicode characters in payload', async () => {
      const unicodeData: UserPayload = {
        id: 'user123',
        email: 'test@例え.com',
        role: '管理者'
      };

      const token = await tokenController.generateToken(unicodeData);
      const validation = await tokenController.validateToken(token);

      expect(validation.valid).toBe(true);
      expect(validation.payload).toMatchObject(unicodeData);
    });

    it('should handle very long user IDs', async () => {
      const longId = 'x'.repeat(1000);
      const userData: UserPayload = { id: longId };

      const token = await tokenController.generateToken(userData);
      const validation = await tokenController.validateToken(token);

      expect(validation.valid).toBe(true);
      expect(validation.payload?.id).toBe(longId);
    });

    it('should handle empty string values in payload', async () => {
      const emptyStringData: UserPayload = {
        id: 'user123',
        email: '',
        role: ''
      };

      const token = await tokenController.generateToken(emptyStringData);
      const validation = await tokenController.validateToken(token);

      expect(validation.valid).toBe(true);
      expect(validation.payload).toMatchObject(emptyStringData);
    });
  });
});