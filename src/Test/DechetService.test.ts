import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { DechetService } from '../services/DechetService';
import Dechet, { categorieAnalyserDechet, IDechet } from '../model/Dechet';
import { Types } from 'mongoose';


jest.mock('../model/Dechet');

describe('DechetService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createDechet', () => {
        it('should create a dechet with compost category', async () => {
            const mockDechet = {
                _id: new Types.ObjectId(),
                categorieAnalyser: categorieAnalyserDechet.Compost,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Dechet as any).mockImplementation(() => mockDechet);

            const result = await DechetService.createDechet(categorieAnalyserDechet.Compost);

            expect(Dechet).toHaveBeenCalledWith({
                categorieAnalyser: categorieAnalyserDechet.Compost,
            });
            expect(mockDechet.save).toHaveBeenCalled();
            expect(result).toEqual(mockDechet);
        });

        it('should create a dechet with recyclage category', async () => {
            const mockDechet = {
                _id: new Types.ObjectId(),
                categorieAnalyser: categorieAnalyserDechet.Recyclage,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Dechet as any).mockImplementation(() => mockDechet);

            const result = await DechetService.createDechet(categorieAnalyserDechet.Recyclage);

            expect(Dechet).toHaveBeenCalledWith({
                categorieAnalyser: categorieAnalyserDechet.Recyclage,
            });
            expect(mockDechet.save).toHaveBeenCalled();
            expect(result.categorieAnalyser).toBe(categorieAnalyserDechet.Recyclage);
        });

        it('should create a dechet with poubelle category', async () => {
            const mockDechet = {
                _id: new Types.ObjectId(),
                categorieAnalyser: categorieAnalyserDechet.Poubelle,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Dechet as any).mockImplementation(() => mockDechet);

            const result = await DechetService.createDechet(categorieAnalyserDechet.Poubelle);

            expect(result.categorieAnalyser).toBe(categorieAnalyserDechet.Poubelle);
            expect(mockDechet.save).toHaveBeenCalled();
        });

        it('should create a dechet with autre category', async () => {
            const mockDechet = {
                _id: new Types.ObjectId(),
                categorieAnalyser: categorieAnalyserDechet.Autre,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Dechet as any).mockImplementation(() => mockDechet);

            const result = await DechetService.createDechet(categorieAnalyserDechet.Autre);

            expect(result.categorieAnalyser).toBe(categorieAnalyserDechet.Autre);
            expect(mockDechet.save).toHaveBeenCalled();
        });

        it('should create a dechet with erreur category', async () => {
            const mockDechet = {
                _id: new Types.ObjectId(),
                categorieAnalyser: categorieAnalyserDechet.Erreur,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Dechet as any).mockImplementation(() => mockDechet);

            const result = await DechetService.createDechet(categorieAnalyserDechet.Erreur);

            expect(result.categorieAnalyser).toBe(categorieAnalyserDechet.Erreur);
            expect(mockDechet.save).toHaveBeenCalled();
        });

        it('should handle save errors', async () => {
            const mockError = new Error('Database save error');
            const mockDechet = {
                _id: new Types.ObjectId(),
                categorieAnalyser: categorieAnalyserDechet.Compost,
                save: (jest.fn() as any).mockRejectedValue(mockError),
            };

            (Dechet as any).mockImplementation(() => mockDechet);

            await expect(
                DechetService.createDechet(categorieAnalyserDechet.Compost)
            ).rejects.toThrow('Database save error');
        });
    });

    describe('getAllDechets', () => {
        it('should return an array of dechet IDs', async () => {
            const mockIds = [
                new Types.ObjectId(),
                new Types.ObjectId(),
                new Types.ObjectId(),
            ];

            const mockDechets = mockIds.map((id) => ({ _id: id }));

            const mockFind = jest.fn().mockReturnValue({
                select: (jest.fn() as any).mockResolvedValue(mockDechets),
            });

            (Dechet.find as jest.Mock) = mockFind;

            const result = await DechetService.getAllDechets();

            expect(mockFind).toHaveBeenCalled();
            expect(result).toEqual(mockIds);
            expect(result).toHaveLength(3);
        });

        it('should return an empty array when no dechets exist', async () => {
            const mockFind = jest.fn().mockReturnValue({
                select: (jest.fn() as any).mockResolvedValue([]),
            });

            (Dechet.find as jest.Mock) = mockFind;

            const result = await DechetService.getAllDechets();

            expect(mockFind).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it('should handle null result', async () => {
            const mockFind = jest.fn().mockReturnValue({
                select: (jest.fn() as any).mockResolvedValue(null),
            });

            (Dechet.find as jest.Mock) = mockFind;

            const result = await DechetService.getAllDechets();

            expect(mockFind).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it('should handle database errors gracefully', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockFind = jest.fn().mockReturnValue({
                select: (jest.fn() as any).mockRejectedValue(new Error('Database connection error')),
            });

            (Dechet.find as jest.Mock) = mockFind;

            const result = await DechetService.getAllDechets();

            expect(mockFind).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith(
                'Erreur lors de la récupération des déchets.'
            );
            expect(result).toBeUndefined();

            consoleLogSpy.mockRestore();
        });

        it('should correctly map dechet objects to their IDs', async () => {
            const id1 = new Types.ObjectId();
            const id2 = new Types.ObjectId();
            const id3 = new Types.ObjectId();

            const mockDechets = [
                { _id: id1 },
                { _id: id2 },
                { _id: id3 },
            ];

            const mockFind = jest.fn().mockReturnValue({
                select: (jest.fn() as any).mockResolvedValue(mockDechets),
            });

            (Dechet.find as jest.Mock) = mockFind;

            const result = await DechetService.getAllDechets();

            expect(result).toEqual([id1, id2, id3]);
            expect(result[0]).toBe(id1);
            expect(result[1]).toBe(id2);
            expect(result[2]).toBe(id3);
        });

        it('should call select with correct parameter', async () => {
            const mockSelect = (jest.fn() as any).mockResolvedValue([]);
            const mockFind = jest.fn().mockReturnValue({
                select: mockSelect,
            });

            (Dechet.find as jest.Mock) = mockFind;

            await DechetService.getAllDechets();

            expect(mockSelect).toHaveBeenCalledWith('_id');
        });
    });
});
