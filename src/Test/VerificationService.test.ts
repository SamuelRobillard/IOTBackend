import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { VerificationService } from '../services/VerificationService';
import Verification, { categorieJeter } from '../model/Verification';

jest.mock('../model/Verification');

describe('VerificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createDechet', () => {
        it('should create a verification successfully', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439011';
            const mockCategorieJeter = categorieJeter.Recyclage;
            const mockVerification = {
                _id: '507f1f77bcf86cd799439012',
                idDechet: mockIdDechet,
                categorieJeter: mockCategorieJeter,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Verification as any).mockImplementation(() => mockVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(Verification.findOne).toHaveBeenCalledWith({ idDechet: mockIdDechet });
            expect(Verification).toHaveBeenCalledWith({
                categorieJeter: mockCategorieJeter,
                idDechet: mockIdDechet,
            });
            expect(mockVerification.save).toHaveBeenCalled();
            expect(result).toEqual(mockVerification);
        });

        it('should return message when verification already exists', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439013';
            const mockCategorieJeter = categorieJeter.Compost;
            const existingVerification = {
                _id: '507f1f77bcf86cd799439014',
                idDechet: mockIdDechet,
                categorieJeter: categorieJeter.Poubelle,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(Verification.findOne).toHaveBeenCalledWith({ idDechet: mockIdDechet });
            expect(result).toBe('Vérification already exists.');
        });

        it('should create verification with Compost category', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439015';
            const mockCategorieJeter = categorieJeter.Compost;
            const mockVerification = {
                _id: '507f1f77bcf86cd799439016',
                idDechet: mockIdDechet,
                categorieJeter: mockCategorieJeter,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Verification as any).mockImplementation(() => mockVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(result.categorieJeter).toBe(categorieJeter.Compost);
            expect(result.idDechet).toBe(mockIdDechet);
        });

        it('should create verification with Poubelle category', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439017';
            const mockCategorieJeter = categorieJeter.Poubelle;
            const mockVerification = {
                _id: '507f1f77bcf86cd799439018',
                idDechet: mockIdDechet,
                categorieJeter: mockCategorieJeter,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Verification as any).mockImplementation(() => mockVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(result.categorieJeter).toBe(categorieJeter.Poubelle);
        });

        it('should create verification with NonJete category', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439019';
            const mockCategorieJeter = categorieJeter.NonJete;
            const mockVerification = {
                _id: '507f1f77bcf86cd799439020',
                idDechet: mockIdDechet,
                categorieJeter: mockCategorieJeter,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Verification as any).mockImplementation(() => mockVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(result.categorieJeter).toBe(categorieJeter.NonJete);
        });

        it('should handle save errors', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439021';
            const mockCategorieJeter = categorieJeter.Recyclage;
            const mockError = new Error('Database save error');
            const mockVerification = {
                _id: '507f1f77bcf86cd799439022',
                idDechet: mockIdDechet,
                categorieJeter: mockCategorieJeter,
                save: (jest.fn() as any).mockRejectedValue(mockError),
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Verification as any).mockImplementation(() => mockVerification);

            await expect(
                VerificationService.createDechet(mockIdDechet, mockCategorieJeter)
            ).rejects.toThrow('Database save error');
        });

        it('should handle findOne errors', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439023';
            const mockCategorieJeter = categorieJeter.Recyclage;
            const mockError = new Error('Database connection error');

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            await expect(
                VerificationService.createDechet(mockIdDechet, mockCategorieJeter)
            ).rejects.toThrow('Database connection error');
        });

        it('should prevent duplicate verifications for same idDechet', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439024';
            const mockCategorieJeter = categorieJeter.Recyclage;
            const existingVerification = {
                _id: '507f1f77bcf86cd799439025',
                idDechet: mockIdDechet,
                categorieJeter: categorieJeter.Compost,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(result).toBe('Vérification already exists.');
            expect(Verification.findOne).toHaveBeenCalledTimes(1);
        });

        it('should create verification with different idDechet', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439026';
            const mockCategorieJeter = categorieJeter.Recyclage;
            const mockVerification = {
                _id: '507f1f77bcf86cd799439027',
                idDechet: mockIdDechet,
                categorieJeter: mockCategorieJeter,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Verification as any).mockImplementation(() => mockVerification);

            const result = await VerificationService.createDechet(mockIdDechet, mockCategorieJeter);

            expect(result.idDechet).toBe(mockIdDechet);
        });
    });

    describe('getVerificationByDechetId', () => {
        it('should return verification when found', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439028';
            const mockVerification = {
                _id: '507f1f77bcf86cd799439029',
                idDechet: mockIdDechet,
                categorieJeter: categorieJeter.Recyclage,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockVerification);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(Verification.findOne).toHaveBeenCalledWith({ idDechet: mockIdDechet });
            expect(result).toEqual(mockVerification);
        });

        it('should return null when verification not found', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439030';

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(Verification.findOne).toHaveBeenCalledWith({ idDechet: mockIdDechet });
            expect(result).toBeNull();
        });

        it('should handle errors and return null', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const mockIdDechet = '507f1f77bcf86cd799439031';
            const mockError = new Error('Database connection error');

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Erreur lors de la recherche de la vérification du déchet:',
                mockError
            );
            expect(result).toBeNull();

            consoleErrorSpy.mockRestore();
        });

        it('should return verification with Compost category', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439032';
            const mockVerification = {
                _id: '507f1f77bcf86cd799439033',
                idDechet: mockIdDechet,
                categorieJeter: categorieJeter.Compost,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockVerification);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(result?.categorieJeter).toBe(categorieJeter.Compost);
        });

        it('should return verification with Poubelle category', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439034';
            const mockVerification = {
                _id: '507f1f77bcf86cd799439035',
                idDechet: mockIdDechet,
                categorieJeter: categorieJeter.Poubelle,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockVerification);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(result?.categorieJeter).toBe(categorieJeter.Poubelle);
        });

        it('should return verification with NonJete category', async () => {
            const mockIdDechet = '507f1f77bcf86cd799439036';
            const mockVerification = {
                _id: '507f1f77bcf86cd799439037',
                idDechet: mockIdDechet,
                categorieJeter: categorieJeter.NonJete,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockVerification);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(result?.categorieJeter).toBe(categorieJeter.NonJete);
        });

        it('should handle multiple consecutive searches', async () => {
            const mockIdDechet1 = '507f1f77bcf86cd799439038';
            const mockIdDechet2 = '507f1f77bcf86cd799439039';
            const mockVerification1 = {
                _id: '507f1f77bcf86cd799439040',
                idDechet: mockIdDechet1,
                categorieJeter: categorieJeter.Recyclage,
            };
            const mockVerification2 = {
                _id: '507f1f77bcf86cd799439041',
                idDechet: mockIdDechet2,
                categorieJeter: categorieJeter.Compost,
            };

            (Verification.findOne as jest.Mock) = (jest.fn() as any)
                .mockResolvedValueOnce(mockVerification1)
                .mockResolvedValueOnce(mockVerification2);

            const result1 = await VerificationService.getVerificationByDechetId(mockIdDechet1);
            const result2 = await VerificationService.getVerificationByDechetId(mockIdDechet2);

            expect(result1).toEqual(mockVerification1);
            expect(result2).toEqual(mockVerification2);
            expect(Verification.findOne).toHaveBeenCalledTimes(2);
        });

        it('should handle empty idDechet string', async () => {
            const mockIdDechet = '';

            (Verification.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await VerificationService.getVerificationByDechetId(mockIdDechet);

            expect(Verification.findOne).toHaveBeenCalledWith({ idDechet: '' });
            expect(result).toBeNull();
        });
    });
});
