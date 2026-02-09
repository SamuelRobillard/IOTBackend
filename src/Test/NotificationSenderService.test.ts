import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { NotificationSenderService } from '../services/NotificationSenderService';
import nodemailer from 'nodemailer';
import config from '../config/config';


jest.mock('nodemailer');
jest.mock('../config/config');

describe('NotificationSenderService', () => {
    let mockTransporter: any;
    let mockSendMail: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockSendMail = (jest.fn() as any).mockResolvedValue({ messageId: 'test-message-id' });
        mockTransporter = {
            sendMail: mockSendMail,
        };

        (nodemailer.createTransport as jest.Mock) = jest.fn().mockReturnValue(mockTransporter);
        (config as any).ourGmail = 'test@gmail.com';
        (config as any).ourGmailPassword = 'testpassword';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('sendNotification', () => {
        it('should send notification email successfully', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'recipient@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            // Attendre que la fonction asynchrone interne se termine
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'test@gmail.com',
                    pass: 'testpassword',
                },
                secure: true,
                port: 465,
            });

            expect(mockSendMail).toHaveBeenCalledWith({
                from: 'test@gmail.com',
                to: mockTo,
                subject: 'testCode',
                text: 'recyclage est remplis',
            });

            expect(consoleLogSpy).toHaveBeenCalledWith('Email sent to recipient@test.com');

            consoleLogSpy.mockRestore();
        });

        it('should send notification with different category', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'admin@test.com';
            const mockCategorie = 'compost';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'compost est remplis',
                })
            );

            consoleLogSpy.mockRestore();
        });

        it('should send notification with poubelle category', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'user@test.com';
            const mockCategorie = 'poubelle';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: mockTo,
                    text: 'poubelle est remplis',
                })
            );

            consoleLogSpy.mockRestore();
        });

        it('should create transporter with correct configuration', async () => {
            const mockTo = 'test@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    secure: true,
                    port: 465,
                })
            );
        });

        it('should use credentials from config', async () => {
            const mockTo = 'test@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({
                    auth: {
                        user: 'test@gmail.com',
                        pass: 'testpassword',
                    },
                })
            );
        });

        it('should send email with correct subject', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'recipient@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    subject: 'testCode',
                })
            );

            consoleLogSpy.mockRestore();
        });

        it('should send email to correct recipient', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'specific-user@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: 'specific-user@test.com',
                })
            );

            consoleLogSpy.mockRestore();
        });

        it('should send email from configured sender', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'recipient@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: 'test@gmail.com',
                })
            );

            consoleLogSpy.mockRestore();
        });

        it('should handle multiple notifications sequentially', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            await NotificationSenderService.sendNotification('user1@test.com', 'recyclage');
            await NotificationSenderService.sendNotification('user2@test.com', 'compost');
            await NotificationSenderService.sendNotification('user3@test.com', 'poubelle');

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledTimes(3);

            consoleLogSpy.mockRestore();
        });

        it('should log success message after sending', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'recipient@test.com';
            const mockCategorie = 'recyclage';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(consoleLogSpy).toHaveBeenCalledWith('Email sent to recipient@test.com');

            consoleLogSpy.mockRestore();
        });

        it('should handle empty category string', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            const mockTo = 'recipient@test.com';
            const mockCategorie = '';

            await NotificationSenderService.sendNotification(mockTo, mockCategorie);

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: ' est remplis',
                })
            );

            consoleLogSpy.mockRestore();
        });

        it('should create new transporter for each notification', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            await NotificationSenderService.sendNotification('user1@test.com', 'recyclage');
            await NotificationSenderService.sendNotification('user2@test.com', 'compost');

            expect(nodemailer.createTransport).toHaveBeenCalledTimes(2);

            consoleLogSpy.mockRestore();
        });
    });
});
