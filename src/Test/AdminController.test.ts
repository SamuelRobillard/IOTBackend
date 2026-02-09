import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { AdminController } from '../controller/AdminController';
import { AdminService } from '../services/AdminService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAdmin } from '../model/Admin';

jest.mock('../services/AdminService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AdminController', () => {
    let adminController: AdminController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;

    beforeEach(() => {
        adminController = new AdminController();
        mockJson = (jest.fn() as any).mockReturnThis();
        mockSend = (jest.fn() as any).mockReturnThis();
        mockStatus = (jest.fn() as any).mockReturnThis();
        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
            send: mockSend as any,
        };
        mockRequest = {
            body: {},
        };

        jest.clearAllMocks();
    });

    describe('createAdmin', () => {
        it('should create an admin successfully and return 201', async () => {
            const adminData = {
                username: 'testadmin',
                password: 'password123',
                email: 'test@admin.com',
            };

            const mockAdmin = {
                _id: '123',
                username: 'testadmin',
                password: 'hashedpassword',
                email: 'test@admin.com',
            };

            mockRequest.body = adminData;
            (AdminService.createAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmin);

            await adminController.createAdmin(mockRequest as Request, mockResponse as Response);

            expect(AdminService.createAdmin).toHaveBeenCalledWith(
                'testadmin',
                'password123',
                'test@admin.com'
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockAdmin);
        });

        it('should return 400 when createAdmin fails', async () => {
            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
                email: 'test@admin.com',
            };

            (AdminService.createAdmin as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Creation failed')
            );

            await adminController.createAdmin(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "probleme creation d'un admin " });
        });

        it('should handle missing fields in request body', async () => {
            mockRequest.body = {
                username: 'testadmin',
            };

            (AdminService.createAdmin as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Missing fields')
            );

            await adminController.createAdmin(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "probleme creation d'un admin " });
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials and return access token', async () => {
            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'testadmin',
                    password: 'hashedpassword',
                    email: 'test@admin.com',
                } as IAdmin,
            ];

            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);
            (bcrypt.compare as jest.Mock) = (jest.fn() as any).mockResolvedValue(true);
            (jwt.sign as jest.Mock) = (jest.fn() as any).mockReturnValue('mock_access_token');

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(AdminService.getAllAdmin).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    id: '123',
                    username: 'testadmin',
                    password: 'hashedpassword',
                    email: 'test@admin.com',
                },
                expect.any(String),
                { expiresIn: '1h' }
            );
            expect(mockJson).toHaveBeenCalledWith({ accessToken: 'mock_access_token' });
        });

        it('should use JWT_SECRET from environment variable', async () => {
            process.env.JWT_SECRET = 'test_secret_key';

            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'testadmin',
                    password: 'hashedpassword',
                    email: 'test@admin.com',
                } as IAdmin,
            ];

            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);
            (bcrypt.compare as jest.Mock) = (jest.fn() as any).mockResolvedValue(true);
            (jwt.sign as jest.Mock) = (jest.fn() as any).mockReturnValue('mock_access_token');

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(jwt.sign).toHaveBeenCalledWith(
                expect.any(Object),
                'test_secret_key',
                expect.any(Object)
            );

            delete process.env.JWT_SECRET;
        });

        it('should use fallback secret when JWT_SECRET is not set', async () => {
            delete process.env.JWT_SECRET;

            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'testadmin',
                    password: 'hashedpassword',
                    email: 'test@admin.com',
                } as IAdmin,
            ];

            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);
            (bcrypt.compare as jest.Mock) = (jest.fn() as any).mockResolvedValue(true);
            (jwt.sign as jest.Mock) = (jest.fn() as any).mockReturnValue('mock_access_token');

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(jwt.sign).toHaveBeenCalledWith(
                expect.any(Object),
                'fallback_secret',
                expect.any(Object)
            );
        });

        it('should return 403 when username is not found', async () => {
            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'otheradmin',
                    password: 'hashedpassword',
                    email: 'other@admin.com',
                } as IAdmin,
            ];

            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockSend).toHaveBeenCalledWith('username ou mot de passe incorrect');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should return 403 when password is incorrect', async () => {
            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'testadmin',
                    password: 'hashedpassword',
                    email: 'test@admin.com',
                } as IAdmin,
            ];

            mockRequest.body = {
                username: 'testadmin',
                password: 'wrongpassword',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);
            (bcrypt.compare as jest.Mock) = (jest.fn() as any).mockResolvedValue(false);

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockSend).toHaveBeenCalledWith('username ou mot de passe incorrect');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should return 500 when getAllAdmin throws an error', async () => {
            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Database error')
            );

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Erreur interne du serveur' });
        });

        it('should return 500 when bcrypt.compare throws an error', async () => {
            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'testadmin',
                    password: 'hashedpassword',
                    email: 'test@admin.com',
                } as IAdmin,
            ];

            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);
            (bcrypt.compare as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Bcrypt error')
            );

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Erreur interne du serveur' });
        });

        it('should handle empty admins list', async () => {
            mockRequest.body = {
                username: 'testadmin',
                password: 'password123',
            };

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue([]);

            await adminController.login(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockSend).toHaveBeenCalledWith('username ou mot de passe incorrect');
        });
    });

    describe('getAllAdmin', () => {
        it('should get all admins successfully and return 201', async () => {
            const mockAdmins: IAdmin[] = [
                {
                    _id: '123',
                    username: 'admin1',
                    password: 'hashedpassword1',
                    email: 'admin1@test.com',
                } as IAdmin,
                {
                    _id: '456',
                    username: 'admin2',
                    password: 'hashedpassword2',
                    email: 'admin2@test.com',
                } as IAdmin,
            ];

            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);

            await adminController.getAllAdmin(mockRequest as Request, mockResponse as Response);

            expect(AdminService.getAllAdmin).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockAdmins);
        });

        it('should return empty array when no admins exist', async () => {
            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockResolvedValue([]);

            await adminController.getAllAdmin(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith([]);
        });

        it('should return 400 when getAllAdmin fails', async () => {
            (AdminService.getAllAdmin as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Database error')
            );

            await adminController.getAllAdmin(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "probleme creation d'un admin " });
        });
    });
});
