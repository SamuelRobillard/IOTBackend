import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { NotificationService } from '../services/NotificationService';
import Notifications from '../model/Notifications';
import { Types } from 'mongoose';

jest.mock('../model/Notifications');

describe('NotificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createNotification', () => {
        it('should create a notification successfully', async () => {
            const mockCategoriePoubelle = 'recyclage';
            const mockIdAdmin = new Types.ObjectId();
            const mockIsFull = true;
            const mockNotifIsSent = false;
            const mockNotification = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: mockIdAdmin,
                isFull: mockIsFull,
                notifIsSent: mockNotifIsSent,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Notifications as any).mockImplementation(() => mockNotification);

            const result = await NotificationService.createNotification(
                mockCategoriePoubelle,
                mockIdAdmin,
                mockIsFull,
                mockNotifIsSent
            );

            expect(Notifications).toHaveBeenCalledWith({
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: mockIdAdmin,
                isFull: mockIsFull,
                notifIsSent: mockNotifIsSent,
            });
            expect(mockNotification.save).toHaveBeenCalled();
            expect(result).toEqual(mockNotification);
        });

        it('should create notification with isFull false', async () => {
            const mockCategoriePoubelle = 'compost';
            const mockIdAdmin = new Types.ObjectId();
            const mockIsFull = false;
            const mockNotifIsSent = false;
            const mockNotification = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: mockIdAdmin,
                isFull: mockIsFull,
                notifIsSent: mockNotifIsSent,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Notifications as any).mockImplementation(() => mockNotification);

            const result = await NotificationService.createNotification(
                mockCategoriePoubelle,
                mockIdAdmin,
                mockIsFull,
                mockNotifIsSent
            );

            expect(result.isFull).toBe(false);
        });

        it('should create notification with notifIsSent true', async () => {
            const mockCategoriePoubelle = 'poubelle';
            const mockIdAdmin = new Types.ObjectId();
            const mockIsFull = true;
            const mockNotifIsSent = true;
            const mockNotification = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: mockIdAdmin,
                isFull: mockIsFull,
                notifIsSent: mockNotifIsSent,
                save: (jest.fn() as any).mockResolvedValue(true),
            };

            (Notifications as any).mockImplementation(() => mockNotification);

            const result = await NotificationService.createNotification(
                mockCategoriePoubelle,
                mockIdAdmin,
                mockIsFull,
                mockNotifIsSent
            );

            expect(result.notifIsSent).toBe(true);
        });

        it('should handle save errors', async () => {
            const mockCategoriePoubelle = 'recyclage';
            const mockIdAdmin = new Types.ObjectId();
            const mockIsFull = true;
            const mockNotifIsSent = false;
            const mockError = new Error('Database save error');
            const mockNotification = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: mockIdAdmin,
                isFull: mockIsFull,
                notifIsSent: mockNotifIsSent,
                save: (jest.fn() as any).mockRejectedValue(mockError),
            };

            (Notifications as any).mockImplementation(() => mockNotification);

            await expect(
                NotificationService.createNotification(
                    mockCategoriePoubelle,
                    mockIdAdmin,
                    mockIsFull,
                    mockNotifIsSent
                )
            ).rejects.toThrow('Database save error');
        });
    });

    describe('getAllNotif', () => {
        it('should return all notifications successfully', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockNotifications = [
                {
                    _id: new Types.ObjectId(),
                    categoriePoubelle: 'recyclage',
                    idAdmin: new Types.ObjectId(),
                    isFull: true,
                    notifIsSent: false,
                },
                {
                    _id: new Types.ObjectId(),
                    categoriePoubelle: 'compost',
                    idAdmin: new Types.ObjectId(),
                    isFull: false,
                    notifIsSent: true,
                },
            ];

            (Notifications.find as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotifications);

            const result = await NotificationService.getAllNotif();

            expect(Notifications.find).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith(mockNotifications);
            expect(result).toEqual(mockNotifications);
            expect(result).toHaveLength(2);

            consoleLogSpy.mockRestore();
        });

        it('should return undefined when empty array is returned', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            (Notifications.find as jest.Mock) = (jest.fn() as any).mockResolvedValue([]);

            const result = await NotificationService.getAllNotif();

            expect(Notifications.find).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith([]);
            expect(result).toEqual([]);

            consoleLogSpy.mockRestore();
        });

        it('should handle database errors gracefully', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockError = new Error('Database connection error');

            (Notifications.find as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            const result = await NotificationService.getAllNotif();

            expect(Notifications.find).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith('Erreur lors de la récupération des notifications.');
            expect(result).toBeUndefined();

            consoleLogSpy.mockRestore();
        });

        it('should handle null result', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            (Notifications.find as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await NotificationService.getAllNotif();

            expect(result).toBeUndefined();

            consoleLogSpy.mockRestore();
        });
    });

    describe('updateByCategorie', () => {
        it('should update isFull by categorie', async () => {
            const mockCategoriePoubelle = 'recyclage';
            const mockUpdates = { isFull: true };
            const mockUpdatedNotif = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: true,
                notifIsSent: false,
            };

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockUpdatedNotif);

            const result = await NotificationService.updateByCategorie(mockCategoriePoubelle, mockUpdates);

            expect(Notifications.findOneAndUpdate).toHaveBeenCalledWith(
                { categoriePoubelle: mockCategoriePoubelle },
                { $set: mockUpdates },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedNotif);
        });

        it('should update notifIsSent by categorie', async () => {
            const mockCategoriePoubelle = 'compost';
            const mockUpdates = { notifIsSent: true };
            const mockUpdatedNotif = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: false,
                notifIsSent: true,
            };

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockUpdatedNotif);

            const result = await NotificationService.updateByCategorie(mockCategoriePoubelle, mockUpdates);

            expect(result.notifIsSent).toBe(true);
        });

        it('should update both isFull and notifIsSent', async () => {
            const mockCategoriePoubelle = 'poubelle';
            const mockUpdates = { isFull: true, notifIsSent: true };
            const mockUpdatedNotif = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: true,
                notifIsSent: true,
            };

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockUpdatedNotif);

            const result = await NotificationService.updateByCategorie(mockCategoriePoubelle, mockUpdates);

            expect(result.isFull).toBe(true);
            expect(result.notifIsSent).toBe(true);
        });

        it('should return null when notification not found', async () => {
            const mockCategoriePoubelle = 'nonexistent';
            const mockUpdates = { isFull: true };

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await NotificationService.updateByCategorie(mockCategoriePoubelle, mockUpdates);

            expect(result).toBeNull();
        });
    });

    describe('updateNotifSentByCategorie', () => {
        it('should update notifIsSent to true', async () => {
            const mockCategoriePoubelle = 'recyclage';
            const mockNotifIsSent = true;
            const mockUpdatedNotif = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: true,
                notifIsSent: mockNotifIsSent,
            };

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockUpdatedNotif);

            const result = await NotificationService.updateNotifSentByCategorie(
                mockCategoriePoubelle,
                mockNotifIsSent
            );

            expect(Notifications.findOneAndUpdate).toHaveBeenCalledWith(
                { categoriePoubelle: mockCategoriePoubelle },
                { $set: { notifIsSent: mockNotifIsSent } },
                { new: true }
            );
            expect(result.notifIsSent).toBe(true);
        });

        it('should update notifIsSent to false', async () => {
            const mockCategoriePoubelle = 'compost';
            const mockNotifIsSent = false;
            const mockUpdatedNotif = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: false,
                notifIsSent: mockNotifIsSent,
            };

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockUpdatedNotif);

            const result = await NotificationService.updateNotifSentByCategorie(
                mockCategoriePoubelle,
                mockNotifIsSent
            );

            expect(result.notifIsSent).toBe(false);
        });

        it('should return null when notification not found', async () => {
            const mockCategoriePoubelle = 'nonexistent';
            const mockNotifIsSent = true;

            (Notifications.findOneAndUpdate as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await NotificationService.updateNotifSentByCategorie(
                mockCategoriePoubelle,
                mockNotifIsSent
            );

            expect(result).toBeNull();
        });
    });

    describe('getIsSentByCategorie', () => {
        it('should return notifIsSent value when notification found', async () => {
            const mockCategoriePoubelle = 'recyclage';
            const mockNotification = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: true,
                notifIsSent: true,
            };

            (Notifications.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotification);

            const result = await NotificationService.getIsSentByCategorie(mockCategoriePoubelle);

            expect(Notifications.findOne).toHaveBeenCalledWith({ categoriePoubelle: mockCategoriePoubelle });
            expect(result).toBe(true);
        });

        it('should return false when notifIsSent is false', async () => {
            const mockCategoriePoubelle = 'compost';
            const mockNotification = {
                _id: new Types.ObjectId(),
                categoriePoubelle: mockCategoriePoubelle,
                idAdmin: new Types.ObjectId(),
                isFull: false,
                notifIsSent: false,
            };

            (Notifications.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(mockNotification);

            const result = await NotificationService.getIsSentByCategorie(mockCategoriePoubelle);

            expect(result).toBe(false);
        });

        it('should return undefined when notification not found', async () => {
            const mockCategoriePoubelle = 'nonexistent';

            (Notifications.findOne as jest.Mock) = (jest.fn() as any).mockResolvedValue(null);

            const result = await NotificationService.getIsSentByCategorie(mockCategoriePoubelle);

            expect(result).toBeUndefined();
        });

        it('should handle errors gracefully', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockCategoriePoubelle = 'recyclage';
            const mockError = new Error('Database connection error');

            (Notifications.findOne as jest.Mock) = (jest.fn() as any).mockRejectedValue(mockError);

            const result = await NotificationService.getIsSentByCategorie(mockCategoriePoubelle);

            expect(consoleLogSpy).toHaveBeenCalledWith('Erreur lors de la récupération des notifications.');
            expect(result).toBeUndefined();

            consoleLogSpy.mockRestore();
        });
    });
});
