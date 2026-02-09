import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { DateService } from '../services/DateService';
import DateModel from '../model/DateModel';

// Mock du modèle DateModel
jest.mock('../model/DateModel');

describe('DateService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createDate', () => {
        it('should create a date successfully', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439011';
            const mockDate = '2024-01-15';
            const mockDateDechet = {
                _id: '507f1f77bcf86cd799439012',
                idDechet: mockIdDechet,
                date: mockDate,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (DateModel as any).mockImplementation(() => mockDateDechet);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(DateModel.findOne).toHaveBeenCalledWith({ idDechet: mockIdDechet });
            expect(DateModel).toHaveBeenCalledWith({
                idDechet: mockIdDechet,
                date: mockDate,
            });
            expect(mockDateDechet.save).toHaveBeenCalled();
            expect(result).toEqual(mockDateDechet);
        });

        it('should return message when date already exists', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439011';
            const mockDate = '2024-01-15';
            const existingDate = {
                _id: '507f1f77bcf86cd799439013',
                idDechet: mockIdDechet,
                date: '2024-01-10',
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingDate);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(DateModel.findOne).toHaveBeenCalledWith({ idDechet: mockIdDechet });
            expect(result).toBe('Date already exists.');
        });

        it('should create date with different idDechet', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439014';
            const mockDate = '2024-02-20';
            const mockDateDechet = {
                _id: '507f1f77bcf86cd799439015',
                idDechet: mockIdDechet,
                date: mockDate,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (DateModel as any).mockImplementation(() => mockDateDechet);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(result.idDechet).toBe(mockIdDechet);
            expect(result.date).toBe(mockDate);
        });

        it('should handle save errors', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439011';
            const mockDate = '2024-01-15';
            const mockError = new Error('Database save error');
            const mockDateDechet = {
                _id: '507f1f77bcf86cd799439012',
                idDechet: mockIdDechet,
                date: mockDate,
                save: (jest.fn() as any).mockRejectedValue(mockError),
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (DateModel as any).mockImplementation(() => mockDateDechet);

            await expect(
                DateService.createDate(mockIdDechet, mockDate)
            ).rejects.toThrow('Database save error');
        });

        it('should handle findOne errors', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439011';
            const mockDate = '2024-01-15';
            const mockError = new Error('Database connection error');

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            await expect(
                DateService.createDate(mockIdDechet, mockDate)
            ).rejects.toThrow('Database connection error');
        });

        it('should create date with valid date format', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439016';
            const mockDate = '2024-12-31';
            const mockDateDechet = {
                _id: '507f1f77bcf86cd799439017',
                idDechet: mockIdDechet,
                date: mockDate,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (DateModel as any).mockImplementation(() => mockDateDechet);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(result.date).toBe('2024-12-31');
        });

        it('should prevent duplicate dates for same idDechet', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439018';
            const mockDate = '2024-03-15';
            const existingDate = {
                _id: '507f1f77bcf86cd799439019',
                idDechet: mockIdDechet,
                date: mockDate,
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingDate);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(result).toBe('Date already exists.');
            expect(DateModel.findOne).toHaveBeenCalledTimes(1);
        });

        it('should handle empty idDechet string', async () => {
            const mockIdDechet = '';
            const mockDate = '2024-01-15';
            const mockDateDechet = {
                _id: '507f1f77bcf86cd799439020',
                idDechet: mockIdDechet,
                date: mockDate,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (DateModel as any).mockImplementation(() => mockDateDechet);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(result.idDechet).toBe('');
        });

        it('should handle empty date string', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439021';
            const mockDate = '';
            const mockDateDechet = {
                _id: '507f1f77bcf86cd799439022',
                idDechet: mockIdDechet,
                date: mockDate,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (DateModel as any).mockImplementation(() => mockDateDechet);

            const result = await DateService.createDate(mockIdDechet, mockDate);

            expect(result.date).toBe('');
        });
    });
});
