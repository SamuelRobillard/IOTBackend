import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { FrontendDataController } from '../controller/FrontendDataController';
import { DechetService } from '../services/DechetService';
import { combineAllDataForAllDechets } from '../services/CombinedDataDechetService';

jest.mock('../services/DechetService');
jest.mock('../services/CombinedDataDechetService');

describe('FrontendDataController', () => {
    let frontendDataController: FrontendDataController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        frontendDataController = new FrontendDataController();
        mockJson = (jest.fn() as any).mockReturnThis();
        mockStatus = (jest.fn() as any).mockReturnThis();
        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };
        mockRequest = {};

        jest.clearAllMocks();
    });

    describe('getAllDechetsDTO', () => {
        it('should get all dechets with combined data successfully and return 200', async () => {
            const mockDechets = [
                { _id: '1', nom: 'Dechet1' },
                { _id: '2', nom: 'Dechet2' },
            ];

            const mockCombinedData = [
                {
                    _id: '1',
                    nom: 'Dechet1',
                    verification: { categorie: 'Recyclage' },
                    date: { date: '2024-01-01' },
                },
                {
                    _id: '2',
                    nom: 'Dechet2',
                    verification: { categorie: 'Compost' },
                    date: { date: '2024-01-02' },
                },
            ];

            (DechetService.getAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechets);
            (combineAllDataForAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockCombinedData);

            await frontendDataController.getAllDechetsDTO(mockRequest as Request, mockResponse as Response);

            expect(DechetService.getAllDechets).toHaveBeenCalled();
            expect(combineAllDataForAllDechets).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockCombinedData);
        });

        it('should return empty array when no dechets exist', async () => {
            const mockDechets: any[] = [];
            const mockCombinedData: any[] = [];

            (DechetService.getAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechets);
            (combineAllDataForAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockCombinedData);

            await frontendDataController.getAllDechetsDTO(mockRequest as Request, mockResponse as Response);

            expect(DechetService.getAllDechets).toHaveBeenCalled();
            expect(combineAllDataForAllDechets).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockCombinedData);
        });

        it('should return 400 when DechetService.getAllDechets fails', async () => {
            (DechetService.getAllDechets as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Database error')
            );

            await frontendDataController.getAllDechetsDTO(mockRequest as Request, mockResponse as Response);

            expect(DechetService.getAllDechets).toHaveBeenCalled();
            expect(combineAllDataForAllDechets).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'erreur lors de la récupération de la liste des déchets.',
            });
        });

        it('should return 400 when combineAllDataForAllDechets fails', async () => {
            const mockDechets = [
                { _id: '1', nom: 'Dechet1' },
                { _id: '2', nom: 'Dechet2' },
            ];

            (DechetService.getAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechets);
            (combineAllDataForAllDechets as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Combine error')
            );

            await frontendDataController.getAllDechetsDTO(mockRequest as Request, mockResponse as Response);

            expect(DechetService.getAllDechets).toHaveBeenCalled();
            expect(combineAllDataForAllDechets).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'erreur lors de la récupération de la liste des déchets.',
            });
        });

        it('should handle large dataset successfully', async () => {
            const mockDechets = Array.from({ length: 100 }, (_, i) => ({
                _id: `${i + 1}`,
                nom: `Dechet${i + 1}`,
            }));

            const mockCombinedData = Array.from({ length: 100 }, (_, i) => ({
                _id: `${i + 1}`,
                nom: `Dechet${i + 1}`,
                verification: { categorie: 'Recyclage' },
                date: { date: '2024-01-01' },
            }));

            (DechetService.getAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockDechets);
            (combineAllDataForAllDechets as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockCombinedData);

            await frontendDataController.getAllDechetsDTO(mockRequest as Request, mockResponse as Response);

            expect(DechetService.getAllDechets).toHaveBeenCalled();
            expect(combineAllDataForAllDechets).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockCombinedData);
        });

        it('should call services in correct order', async () => {
            const mockDechets = [{ _id: '1', nom: 'Dechet1' }];
            const mockCombinedData = [
                {
                    _id: '1',
                    nom: 'Dechet1',
                    verification: { categorie: 'Recyclage' },
                    date: { date: '2024-01-01' },
                },
            ];

            const callOrder: string[] = [];

            (DechetService.getAllDechets as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                callOrder.push('getAllDechets');
                return Promise.resolve(mockDechets);
            });

            (combineAllDataForAllDechets as jest.Mock) = (jest.fn() as any).mockImplementation(() => {
                callOrder.push('combineAllDataForAllDechets');
                return Promise.resolve(mockCombinedData);
            });

            await frontendDataController.getAllDechetsDTO(mockRequest as Request, mockResponse as Response);

            expect(callOrder).toEqual(['getAllDechets', 'combineAllDataForAllDechets']);
        });
    });
});
