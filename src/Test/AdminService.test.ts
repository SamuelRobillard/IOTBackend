import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { AdminService } from '../services/AdminService';
import Admin from '../model/Admin';
import bcrypt from 'bcryptjs';

jest.mock('../model/Admin');
jest.mock('bcryptjs');

describe('AdminService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createAdmin', () => {
        it('should create an admin successfully', async () => {
            const mockUsername = 'testadmin';
            const mockPassword = 'password123';
            const mockEmail = 'admin@test.com';
            const mockHashedPassword = 'hashedPassword123';
            const mockAdmin = {
                _id: '507f1f77bcf86cd799439011',
                username: mockUsername,
                password: mockHashedPassword,
                email: mockEmail,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockHashedPassword);
            (Admin as any).mockImplementation(() => mockAdmin);

            const result = await AdminService.createAdmin(mockUsername, mockPassword, mockEmail);

            expect(Admin.findOne).toHaveBeenCalledWith({
                $or: [
                    { username: mockUsername },
                    { email: mockEmail }
                ]
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
            expect(Admin).toHaveBeenCalledWith({
                username: mockUsername,
                password: mockHashedPassword,
                email: mockEmail,
            });
            expect(mockAdmin.save).toHaveBeenCalled();
            expect(result).toEqual(mockAdmin);
        });

        it('should return message when username already exists', async () => {
            const mockUsername = 'existingadmin';
            const mockPassword = 'password123';
            const mockEmail = 'newemail@test.com';
            const existingAdmin = {
                _id: '507f1f77bcf86cd799439012',
                username: mockUsername,
                email: 'existing@test.com',
            };

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingAdmin);

            const result = await AdminService.createAdmin(mockUsername, mockPassword, mockEmail);

            expect(Admin.findOne).toHaveBeenCalledWith({
                $or: [
                    { username: mockUsername },
                    { email: mockEmail }
                ]
            });
            expect(result).toBe('username or email already exists');
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });

        it('should return message when email already exists', async () => {
            const mockUsername = 'newadmin';
            const mockPassword = 'password123';
            const mockEmail = 'existing@test.com';
            const existingAdmin = {
                _id: '507f1f77bcf86cd799439013',
                username: 'otheradmin',
                email: mockEmail,
            };

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingAdmin);

            const result = await AdminService.createAdmin(mockUsername, mockPassword, mockEmail);

            expect(result).toBe('username or email already exists');
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });

        it('should hash password with bcrypt salt 10', async () => {
            const mockUsername = 'testadmin';
            const mockPassword = 'mySecurePassword';
            const mockEmail = 'admin@test.com';
            const mockHashedPassword = '$2a$10$hashedpassword';
            const mockAdmin = {
                _id: '507f1f77bcf86cd799439014',
                username: mockUsername,
                password: mockHashedPassword,
                email: mockEmail,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockHashedPassword);
            (Admin as any).mockImplementation(() => mockAdmin);

            await AdminService.createAdmin(mockUsername, mockPassword, mockEmail);

            expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
        });

        it('should handle save errors', async () => {
            const mockUsername = 'testadmin';
            const mockPassword = 'password123';
            const mockEmail = 'admin@test.com';
            const mockHashedPassword = 'hashedPassword123';
            const mockError = new Error('Database save error');
            const mockAdmin = {
                _id: '507f1f77bcf86cd799439015',
                username: mockUsername,
                password: mockHashedPassword,
                email: mockEmail,
                save: (jest.fn() as any).mockRejectedValue(mockError),
            };

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockHashedPassword);
            (Admin as any).mockImplementation(() => mockAdmin);

            await expect(
                AdminService.createAdmin(mockUsername, mockPassword, mockEmail)
            ).rejects.toThrow('Database save error');
        });

        it('should handle bcrypt hash errors', async () => {
            const mockUsername = 'testadmin';
            const mockPassword = 'password123';
            const mockEmail = 'admin@test.com';
            const mockError = new Error('Hashing error');

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            await expect(
                AdminService.createAdmin(mockUsername, mockPassword, mockEmail)
            ).rejects.toThrow('Hashing error');
        });

        it('should create admin with different credentials', async () => {
            const mockUsername = 'admin2';
            const mockPassword = 'anotherPassword';
            const mockEmail = 'admin2@test.com';
            const mockHashedPassword = 'hashedPassword456';
            const mockAdmin = {
                _id: '507f1f77bcf86cd799439016',
                username: mockUsername,
                password: mockHashedPassword,
                email: mockEmail,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockHashedPassword);
            (Admin as any).mockImplementation(() => mockAdmin);

            const result = await AdminService.createAdmin(mockUsername, mockPassword, mockEmail);

            expect(result.username).toBe(mockUsername);
            expect(result.email).toBe(mockEmail);
            expect(result.password).toBe(mockHashedPassword);
        });

        it('should handle findOne errors', async () => {
            const mockUsername = 'testadmin';
            const mockPassword = 'password123';
            const mockEmail = 'admin@test.com';
            const mockError = new Error('Database connection error');

            (Admin.findOne as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            await expect(
                AdminService.createAdmin(mockUsername, mockPassword, mockEmail)
            ).rejects.toThrow('Database connection error');
        });
    });

    describe('getAllAdmin', () => {
        it('should return all admins successfully', async () => {
            const mockAdmins = [
                {
                    _id: '507f1f77bcf86cd799439017',
                    username: 'admin1',
                    email: 'admin1@test.com',
                    password: 'hashedPassword1',
                },
                {
                    _id: '507f1f77bcf86cd799439018',
                    username: 'admin2',
                    email: 'admin2@test.com',
                    password: 'hashedPassword2',
                },
                {
                    _id: '507f1f77bcf86cd799439019',
                    username: 'admin3',
                    email: 'admin3@test.com',
                    password: 'hashedPassword3',
                },
            ];

            (Admin.find as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);

            const result = await AdminService.getAllAdmin();

            expect(Admin.find).toHaveBeenCalled();
            expect(result).toEqual(mockAdmins);
            expect(result).toHaveLength(3);
        });

        it('should return empty array when no admins exist', async () => {
            (Admin.find as jest.Mock) = (jest.fn() as any).mockResolvedValue([]);

            const result = await AdminService.getAllAdmin();

            expect(Admin.find).toHaveBeenCalled();
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should throw error when database query fails', async () => {
            const mockError = new Error('Database query error');

            (Admin.find as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            await expect(AdminService.getAllAdmin()).rejects.toThrow(
                'Erreur lors de la récupération des Admins: Error: Database query error'
            );
        });

        it('should return correct admin structure', async () => {
            const mockAdmins = [
                {
                    _id: '507f1f77bcf86cd799439020',
                    username: 'testadmin',
                    email: 'test@test.com',
                    password: 'hashedPassword',
                },
            ];

            (Admin.find as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);

            const result = await AdminService.getAllAdmin();

            expect(result[0]).toHaveProperty('_id');
            expect(result[0]).toHaveProperty('username');
            expect(result[0]).toHaveProperty('email');
            expect(result[0]).toHaveProperty('password');
        });

        it('should handle multiple admins retrieval', async () => {
            const mockAdmins = Array.from({ length: 10 }, (_, i) => ({
                _id: `507f1f77bcf86cd79943${i.toString().padStart(4, '0')}`,
                username: `admin${i}`,
                email: `admin${i}@test.com`,
                password: `hashedPassword${i}`,
            }));

            (Admin.find as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockAdmins);

            const result = await AdminService.getAllAdmin();

            expect(result).toHaveLength(10);
            expect(Admin.find).toHaveBeenCalledTimes(1);
        });
    });
});
