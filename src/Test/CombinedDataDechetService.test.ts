import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import createCombinedDocuments, { combineAllDataForOneDechetByHisId, combineAllDataForAllDechets } from '../services/CombinedDataDechetService';
import Dechet, { categorieAnalyserDechet } from '../model/Dechet';
import DateModel from '../model/DateModel';
import DTODechet from '../model/DTODechet';
import { DateService } from '../services/DateService';
import { VerificationService } from '../services/VerificationService';
import { DechetService } from '../services/DechetService';
import { categorieJeter } from '../model/Verification';
import { Types } from 'mongoose';


jest.mock('../model/Dechet');
jest.mock('../model/DateModel');
jest.mock('../services/DateService');
jest.mock('../services/VerificationService');
jest.mock('../services/DechetService');

describe('CombinedDataDechetService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createCombinedDocuments', () => {
        it('should create combined documents successfully', async () => {
            const mockDechetId = new Types.ObjectId().toString();
            const mockDechet = { _id: mockDechetId, categorieAnalyser: categorieAnalyserDechet.Recyclage };
            const mockDate = { idDechet: mockDechetId, date: '2024-01-01' };
            const mockVerification = { idDechet: mockDechetId, categorieJeter: categorieJeter.Recyclage };

            (DechetService.createDechet as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechet);
            (DateService.createDate as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDate);
            (VerificationService.createDechet as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockVerification);

            const result = await createCombinedDocuments(
                categorieAnalyserDechet.Recyclage,
                categorieJeter.Recyclage,
                '2024-01-01'
            );

            expect(DechetService.createDechet).toHaveBeenCalledWith(categorieAnalyserDechet.Recyclage);
            expect(DateService.createDate).toHaveBeenCalledWith(mockDechetId, '2024-01-01');
            expect(VerificationService.createDechet).toHaveBeenCalledWith(mockDechetId, categorieJeter.Recyclage);

            expect(result).toEqual({
                idDechet: mockDechetId,
                date: '2024-01-01',
                categorieAnalyser: categorieAnalyserDechet.Recyclage,
                categorieJeter: categorieJeter.Recyclage,
            });
        });

        it('should throw error when categorieAnalyser is missing', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await createCombinedDocuments(
                null as any,
                categorieJeter.Recyclage,
                '2024-01-01'
            );

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result).toBeUndefined();

            consoleErrorSpy.mockRestore();
        });

        it('should return null when dechet creation fails', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockDechet = { _id: null, categorieAnalyser: categorieAnalyserDechet.Recyclage };

            (DechetService.createDechet as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechet);

            const result = await createCombinedDocuments(
                categorieAnalyserDechet.Recyclage,
                categorieJeter.Recyclage,
                '2024-01-01'
            );

            expect(consoleLogSpy).toHaveBeenCalledWith('erreur lors de la création du déchet');
            expect(result).toBeNull();

            consoleLogSpy.mockRestore();
        });
    });

    describe('combineAllDataForOneDechetByHisId', () => {
        it('should combine all data successfully', async () => {
            const mockDechetId = new Types.ObjectId().toString();
            const mockDechet = {
                _id: mockDechetId,
                categorieAnalyser: categorieAnalyserDechet.Recyclage,
            };
            const mockVerification = {
                idDechet: mockDechetId,
                categorieJeter: categorieJeter.Recyclage,
            };
            const mockDateRecord = {
                idDechet: mockDechetId,
                date: '2024-01-01',
            };

            (Dechet.findById as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechet);
            (VerificationService.getVerificationByDechetId as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockVerification);
            (DateModel.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDateRecord);

            const result = await combineAllDataForOneDechetByHisId(mockDechetId);

            expect(result).toBeInstanceOf(DTODechet);
            expect(result?.idDechet).toBe(mockDechetId);
        });

        it('should return null when dechet is not found', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockDechetId = new Types.ObjectId().toString();

            (Dechet.findById as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await combineAllDataForOneDechetByHisId(mockDechetId);

            expect(consoleLogSpy).toHaveBeenCalledWith('Déchet non trouvé');
            expect(result).toBeNull();

            consoleLogSpy.mockRestore();
        });
    });

    describe('combineAllDataForAllDechets', () => {
        it('should combine data for all dechets', async () => {
            const mockId1 = new Types.ObjectId().toString();
            const mockId2 = new Types.ObjectId().toString();

            const mockDechet1 = { _id: mockId1, categorieAnalyser: categorieAnalyserDechet.Recyclage };
            const mockDechet2 = { _id: mockId2, categorieAnalyser: categorieAnalyserDechet.Compost };

            const mockVerification1 = { idDechet: mockId1, categorieJeter: categorieJeter.Recyclage };
            const mockVerification2 = { idDechet: mockId2, categorieJeter: categorieJeter.Compost };

            const mockDate1 = { idDechet: mockId1, date: '2024-01-01' };
            const mockDate2 = { idDechet: mockId2, date: '2024-01-02' };

            (Dechet.findById as jest.Mock) = (jest.fn() as any)
                .mockResolvedValueOnce(mockDechet1)
                .mockResolvedValueOnce(mockDechet2);

            (VerificationService.getVerificationByDechetId as jest.Mock) = (jest.fn() as any)
                .mockResolvedValueOnce(mockVerification1)
                .mockResolvedValueOnce(mockVerification2);

            (DateModel.findOne as jest.Mock) = (jest.fn() as any)
                .mockResolvedValueOnce(mockDate1)
                .mockResolvedValueOnce(mockDate2);

            const result = await combineAllDataForAllDechets([mockId1, mockId2]);

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(DTODechet);
            expect(result[1]).toBeInstanceOf(DTODechet);
        });

        it('should return null when input is null', async () => {
            const result = await combineAllDataForAllDechets(null as any);

            expect(result).toBeNull();
        });
    });
});
