import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Request, Response } from 'express';
import { NotificationsController } from '../controller/NotificationController';
import { NotificationService } from '../services/NotificationService';
import { NotificationSenderService } from '../services/NotificationSenderService';

jest.mock('../services/NotificationService');
jest.mock('../services/NotificationSenderService');

describe('NotificationsController', () => {
    let notificationsController: NotificationsController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let consoleErrorSpy: any;
    let consoleLogSpy: any;

    beforeEach(() => {
        notificationsController = new NotificationsController();
        mockJson = (jest.fn() as any).mockReturnThis();
        mockStatus = (jest.fn() as any).mockReturnThis();
        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };
        mockRequest = {
            body: {},
            params: {},
        };

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

    describe('createNotif', () => {
        it('should create a notification successfully and return 201', async () => {
            const notifData = {
                categoriePoubelle: 'Compost',
                idAdmin: 'admin123',
                isFull: false,
                notifIsSent: false,
            };

            const mockNotif = {
                _id: '1',
                categoriePoubelle: 'Compost',
                idAdmin: 'admin123',
                isFull: false,
                notifIsSent: false,
            };

            mockRequest.body = notifData;
            (NotificationService.createNotification as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);

            await notificationsController.createNotif(mockRequest as Request, mockResponse as Response);

            expect(NotificationService.createNotification).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockNotif);
        });

        it('should return 400 when createNotification fails', async () => {
            mockRequest.body = {
                categoriePoubelle: 'Recyclage',
                idAdmin: 'admin123',
                isFull: true,
                notifIsSent: false,
            };

            (NotificationService.createNotification as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Database error')
            );

            await notificationsController.createNotif(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "probleme creation d'une notification " });
        });

        it('should handle notification with isFull true', async () => {
            const notifData = {
                categoriePoubelle: 'Poubelle',
                idAdmin: 'admin456',
                isFull: true,
                notifIsSent: false,
            };

            const mockNotif = {
                _id: '2',
                ...notifData,
            };

            mockRequest.body = notifData;
            (NotificationService.createNotification as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);

            await notificationsController.createNotif(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockNotif);
        });
    });

    describe('updateNotif', () => {
        it('should update notification successfully when isFull is false', async () => {
            const mockNotif = {
                _id: '1',
                categoriePoubelle: 'Compost',
                idAdmin: 'admin123',
                isFull: false,
                notifIsSent: false,
            };

            mockRequest.params = { categoriePoubelle: 'Compost' };
            mockRequest.body = { isFull: false };

            (NotificationService.updateByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(NotificationService.updateByCategorie).toHaveBeenCalledWith('Compost', { isFull: false });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockNotif);
            expect(NotificationSenderService.sendNotification).not.toHaveBeenCalled();
        });

        it('should update notification and send email when isFull is true and not sent yet', async () => {
            const mockNotif = {
                _id: '1',
                categoriePoubelle: 'Recyclage',
                idAdmin: 'admin123',
                isFull: true,
                notifIsSent: false,
            };

            mockRequest.params = { categoriePoubelle: 'Recyclage' };
            mockRequest.body = { isFull: true };

            (NotificationService.updateByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);
            (NotificationService.getIsSentByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(false);
            (NotificationSenderService.sendNotification as jest.Mock) = (jest.fn() as any).mockResolvedValue(true);
            (NotificationService.updateNotifSentByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(NotificationService.updateByCategorie).toHaveBeenCalledWith('Recyclage', { isFull: true });
            expect(NotificationService.getIsSentByCategorie).toHaveBeenCalledWith('Recyclage');
            expect(NotificationSenderService.sendNotification).toHaveBeenCalledWith(
                'samuelben.robillard@gmail.com',
                'Recyclage'
            );
            expect(NotificationService.updateNotifSentByCategorie).toHaveBeenCalledWith('Recyclage', true);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockNotif);
        });

        it('should not send email when isFull is true but notification already sent', async () => {
            const mockNotif = {
                _id: '1',
                categoriePoubelle: 'Poubelle',
                idAdmin: 'admin123',
                isFull: true,
                notifIsSent: true,
            };

            mockRequest.params = { categoriePoubelle: 'Poubelle' };
            mockRequest.body = { isFull: true };

            (NotificationService.updateByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);
            (NotificationService.getIsSentByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(true);

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(NotificationService.getIsSentByCategorie).toHaveBeenCalledWith('Poubelle');
            expect(NotificationSenderService.sendNotification).not.toHaveBeenCalled();
            expect(NotificationService.updateNotifSentByCategorie).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it('should return 400 when categoriePoubelle is missing', async () => {
            mockRequest.params = {};
            mockRequest.body = { isFull: true };

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'categoriePoubelle requise' });
            expect(NotificationService.updateByCategorie).not.toHaveBeenCalled();
        });

        it('should return 400 when no valid fields to update', async () => {
            mockRequest.params = { categoriePoubelle: 'Compost' };
            mockRequest.body = {};

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Aucun champ valide à mettre à jour' });
            expect(NotificationService.updateByCategorie).not.toHaveBeenCalled();
        });

        it('should return 404 when notification is not found', async () => {
            mockRequest.params = { categoriePoubelle: 'Unknown' };
            mockRequest.body = { isFull: true };

            (NotificationService.updateByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(NotificationService.updateByCategorie).toHaveBeenCalledWith('Unknown', { isFull: true });
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Notification non trouvée' });
        });

        it('should return 500 when an error occurs', async () => {
            mockRequest.params = { categoriePoubelle: 'Compost' };
            mockRequest.body = { isFull: true };

            (NotificationService.updateByCategorie as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Database error')
            );

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Erreur serveur' });
        });

        it('should handle isFull undefined in body', async () => {
            mockRequest.params = { categoriePoubelle: 'Compost' };
            mockRequest.body = { isFull: undefined };

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Aucun champ valide à mettre à jour' });
        });

        it('should log idAdmin when sending notification', async () => {
            const mockNotif = {
                _id: '1',
                categoriePoubelle: 'Recyclage',
                idAdmin: 'admin789',
                isFull: true,
                notifIsSent: false,
            };

            mockRequest.params = { categoriePoubelle: 'Recyclage' };
            mockRequest.body = { isFull: true };

            (NotificationService.updateByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);
            (NotificationService.getIsSentByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(false);
            (NotificationSenderService.sendNotification as jest.Mock) = (jest.fn() as any).mockResolvedValue(true);
            (NotificationService.updateNotifSentByCategorie as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotif);

            await notificationsController.updateNotif(mockRequest as Request, mockResponse as Response);

            expect(consoleLogSpy).toHaveBeenCalledWith('admin789');
        });
    });

    describe('getAllNotifs', () => {
        it('should get all notifications successfully and return 201', async () => {
            const mockNotifs = [
                {
                    _id: '1',
                    categoriePoubelle: 'Compost',
                    idAdmin: 'admin123',
                    isFull: false,
                    notifIsSent: false,
                },
                {
                    _id: '2',
                    categoriePoubelle: 'Recyclage',
                    idAdmin: 'admin456',
                    isFull: true,
                    notifIsSent: true,
                },
            ];

            (NotificationService.getAllNotif as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotifs);

            await notificationsController.getAllNotifs(mockRequest as Request, mockResponse as Response);

            expect(NotificationService.getAllNotif).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockNotifs);
        });

        it('should return empty array when no notifications exist', async () => {
            (NotificationService.getAllNotif as jest.Mock) = (jest.fn() as any).mockResolvedValue([]);

            await notificationsController.getAllNotifs(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith([]);
        });

        it('should return 400 when getAllNotif fails', async () => {
            (NotificationService.getAllNotif as jest.Mock) = (jest.fn() as any).mockRejectedValue(
                new Error('Database error')
            );

            await notificationsController.getAllNotifs(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'probleme get notifications' });
        });
    });
});
