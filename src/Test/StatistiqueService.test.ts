import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { StatistiqueService } from '../services/StatistiqueService';
import Statistique, { categorieAnalyser } from '../model/Statistique';


jest.mock('../model/Statistique');

describe('StatistiqueService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createStatistique', () => {
        it('should create a statistique successfully', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Recyclage;
            const mockTotalNumber = 100;
            const mockRatio = 0.75;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439011',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(Statistique.findOne).toHaveBeenCalledWith({ categorieAnalyser: mockCategorieAnalyser });
            expect(Statistique).toHaveBeenCalledWith({
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
            });
            expect(mockStatistique.save).toHaveBeenCalled();
            expect(result).toEqual(mockStatistique);
        });

        it('should return message when statistique already exists', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Compost;
            const mockTotalNumber = 50;
            const mockRatio = 0.5;
            const existingStatistique = {
                _id: '507f1f77bcf86cd799439012',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: 30,
                ratio: 0.4,
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(Statistique.findOne).toHaveBeenCalledWith({ categorieAnalyser: mockCategorieAnalyser });
            expect(result).toBe('Statistic already exists');
        });

        it('should create statistique with Compost category', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Compost;
            const mockTotalNumber = 80;
            const mockRatio = 0.6;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439013',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.categorieAnalyser).toBe(categorieAnalyser.Compost);
            expect(result.TotalNumber).toBe(mockTotalNumber);
            expect(result.ratio).toBe(mockRatio);
        });

        it('should create statistique with Poubelle category', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Poubelle;
            const mockTotalNumber = 120;
            const mockRatio = 0.85;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439014',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.categorieAnalyser).toBe(categorieAnalyser.Poubelle);
        });

        it('should create statistique with Autre category', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Autre;
            const mockTotalNumber = 25;
            const mockRatio = 0.2;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439015',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.categorieAnalyser).toBe(categorieAnalyser.Autre);
        });

        it('should create statistique with Erreur category', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Erreur;
            const mockTotalNumber = 5;
            const mockRatio = 0.05;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439016',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.categorieAnalyser).toBe(categorieAnalyser.Erreur);
        });

        it('should handle save errors', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Recyclage;
            const mockTotalNumber = 100;
            const mockRatio = 0.75;
            const mockError = new Error('Database save error');
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439017',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockRejectedValue(mockError),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            await expect(
                StatistiqueService.createStatistique(mockCategorieAnalyser, mockTotalNumber, mockRatio)
            ).rejects.toThrow('Database save error');
        });

        it('should handle findOne errors', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Recyclage;
            const mockTotalNumber = 100;
            const mockRatio = 0.75;
            const mockError = new Error('Database connection error');

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            await expect(
                StatistiqueService.createStatistique(mockCategorieAnalyser, mockTotalNumber, mockRatio)
            ).rejects.toThrow('Database connection error');
        });

        it('should create statistique with zero TotalNumber', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Recyclage;
            const mockTotalNumber = 0;
            const mockRatio = 0;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439018',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.TotalNumber).toBe(0);
            expect(result.ratio).toBe(0);
        });

        it('should create statistique with ratio 1', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Recyclage;
            const mockTotalNumber = 200;
            const mockRatio = 1;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439019',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.ratio).toBe(1);
        });

        it('should prevent duplicate statistiques for same category', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Recyclage;
            const mockTotalNumber = 100;
            const mockRatio = 0.75;
            const existingStatistique = {
                _id: '507f1f77bcf86cd799439020',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: 50,
                ratio: 0.5,
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(existingStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result).toBe('Statistic already exists');
            expect(Statistique.findOne).toHaveBeenCalledTimes(1);
        });

        it('should create statistique with large numbers', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Compost;
            const mockTotalNumber = 999999;
            const mockRatio = 0.999;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439021',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.TotalNumber).toBe(999999);
            expect(result.ratio).toBe(0.999);
        });

        it('should create statistique with decimal ratio', async () => {
            const mockCategorieAnalyser = categorieAnalyser.Poubelle;
            const mockTotalNumber = 150;
            const mockRatio = 0.123456;
            const mockStatistique = {
                _id: '507f1f77bcf86cd799439022',
                categorieAnalyser: mockCategorieAnalyser,
                TotalNumber: mockTotalNumber,
                ratio: mockRatio,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Statistique.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);
            (Statistique as any).mockImplementation(() => mockStatistique);

            const result = await StatistiqueService.createStatistique(
                mockCategorieAnalyser,
                mockTotalNumber,
                mockRatio
            );

            expect(result.ratio).toBe(0.123456);
        });
    });
});
