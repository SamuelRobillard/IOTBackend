import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockJson = jest.fn() as any;
        mockStatus = (jest.fn() as any).mockReturnValue({ json: mockJson });
        
        mockRequest = {
            headers: {},
            user: undefined,
        };
        
        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };
        
        mockNext = jest.fn() as any;
        
        process.env.JWT_SECRET = 'test_secret';
    });

    afterEach(() => {
        jest.restoreAllMocks();
        delete process.env.JWT_SECRET;
    });

    describe('Token validation', () => {
        it('should return 401 when authorization header is missing', () => {
            mockRequest.headers = {};

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token manquant' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when token is not provided in authorization header', () => {
            mockRequest.headers = {
                authorization: 'Bearer ',
            };

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token manquant' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when authorization header does not contain Bearer token', () => {
            mockRequest.headers = {
                authorization: 'InvalidFormat',
            };

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token manquant' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 when token is invalid', () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid_token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token invalide ou expiré' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 when token is expired', () => {
            mockRequest.headers = {
                authorization: 'Bearer expired_token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                throw new Error('jwt expired');
            });

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token invalide ou expiré' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next() when token is valid', () => {
            const mockDecoded = { id: '123', username: 'testuser' };
            mockRequest.headers = {
                authorization: 'Bearer valid_token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockReturnValue(mockDecoded);

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
            expect(mockRequest.user).toEqual(mockDecoded);
            expect(mockNext).toHaveBeenCalled();
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('should attach decoded user data to request', () => {
            const mockDecoded = { 
                id: '456', 
                username: 'admin',
                email: 'admin@test.com',
                role: 'admin'
            };
            mockRequest.headers = {
                authorization: 'Bearer valid_token_with_data',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockReturnValue(mockDecoded);

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockRequest.user).toEqual(mockDecoded);
            expect(mockRequest.user.id).toBe('456');
            expect(mockRequest.user.username).toBe('admin');
            expect(mockRequest.user.email).toBe('admin@test.com');
            expect(mockRequest.user.role).toBe('admin');
            expect(mockNext).toHaveBeenCalled();
        });

        it('should use JWT_SECRET from environment variable', () => {
            const mockDecoded = { id: '789', username: 'user' };
            mockRequest.headers = {
                authorization: 'Bearer token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockReturnValue(mockDecoded);

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith('token', 'test_secret');
        });

        it('should use fallback secret when JWT_SECRET is not set', () => {
            delete process.env.JWT_SECRET;
            
            const mockDecoded = { id: '999', username: 'fallbackuser' };
            mockRequest.headers = {
                authorization: 'Bearer token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockReturnValue(mockDecoded);

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith('token', 'fallback_secret');
            expect(mockNext).toHaveBeenCalled();
        });

        it('should extract token correctly from Bearer authorization header', () => {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
            const mockDecoded = { id: '111', username: 'tokenuser' };
            mockRequest.headers = {
                authorization: `Bearer ${mockToken}`,
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockReturnValue(mockDecoded);

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test_secret');
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 401 when authorization header has extra spaces', () => {
            mockRequest.headers = {
                authorization: 'Bearer  ',
            };

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token manquant' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should not call next() when token verification fails', () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                throw new Error('Token verification failed');
            });

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(403);
        });

        it('should handle JsonWebTokenError', () => {
            mockRequest.headers = {
                authorization: 'Bearer malformed_token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                const error: any = new Error('jwt malformed');
                error.name = 'JsonWebTokenError';
                throw error;
            });

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token invalide ou expiré' });
        });

        it('should handle TokenExpiredError', () => {
            mockRequest.headers = {
                authorization: 'Bearer expired_token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                const error: any = new Error('jwt expired');
                error.name = 'TokenExpiredError';
                throw error;
            });

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Token invalide ou expiré' });
        });

        it('should process valid token with minimal user data', () => {
            const mockDecoded = { id: '333' };
            mockRequest.headers = {
                authorization: 'Bearer minimal_token',
            };

            (jwt.verify as jest.Mock) = (jest.fn() as any).mockReturnValue(mockDecoded);

            authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

            expect(mockRequest.user).toEqual({ id: '333' });
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
