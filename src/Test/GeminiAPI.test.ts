import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { GeminiAPi } from '../services/GeminiAPI';
import { GoogleGenAI } from '@google/genai';

jest.mock('@google/genai');


let mockGeminiApiKey = 'test-api-key';
jest.mock('../config/config', () => ({
    __esModule: true,
    default: {
        get geminiApiKey() {
            return mockGeminiApiKey;
        },
    },
}));

describe('GeminiAPi', () => {
    let consoleLogSpy: any;
    let consoleErrorSpy: any;
    let mockGenerateContent: jest.Mock;
    let mockAi: any;

    beforeEach(() => {
        mockGeminiApiKey = 'test-api-key';
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mockGenerateContent = (jest.fn() as any);
        mockAi = {
            models: {
                generateContent: mockGenerateContent,
            },
        };

        (GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>).mockImplementation((() => mockAi) as any);

        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    describe('callAPI', () => {
        it('should call Gemini API successfully and return response text', async () => {
            const mockImageBase64 = 'base64encodedimage';
            const mockResponseText = 'This is a description of the image';

            (mockGenerateContent as any).mockResolvedValue({
                text: mockResponseText,
            });

            const result = await GeminiAPi.callAPI(mockImageBase64);

            expect(GoogleGenAI).toHaveBeenCalledWith({
                apiKey: 'test-api-key',
            });
            expect(mockGenerateContent).toHaveBeenCalledWith({
                model: 'gemini-3-flash-preview',
                contents: 'describe the image in base 64 : base64encodedimage',
            });
            expect(consoleLogSpy).toHaveBeenCalledWith(mockResponseText);
            expect(result).toBe(mockResponseText);
        });

        it('should throw error when API key is not defined', async () => {
            mockGeminiApiKey = undefined as any;

            await expect(GeminiAPi.callAPI('somebase64')).rejects.toThrow(
                "L'API Key Gemini n'est pas définie dans les variables d'environnement."
            );
        });

        it('should throw error when API key is empty string', async () => {
            mockGeminiApiKey = '';

            await expect(GeminiAPi.callAPI('somebase64')).rejects.toThrow(
                "L'API Key Gemini n'est pas définie dans les variables d'environnement."
            );
        });

        it('should handle API errors and log them', async () => {
            const mockError = new Error('API Error');
            (mockGenerateContent as any).mockRejectedValue(mockError);

            const result = await GeminiAPi.callAPI('testimage');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error calling the Gemini API:', mockError);
            expect(result).toBeUndefined();
        });

        it('should handle empty base64 string', async () => {
            const mockResponseText = 'No image provided';

            (mockGenerateContent as any).mockResolvedValue({
                text: mockResponseText,
            });

            const result = await GeminiAPi.callAPI('');

            expect(mockGenerateContent).toHaveBeenCalledWith({
                model: 'gemini-3-flash-preview',
                contents: 'describe the image in base 64 : ',
            });
            expect(result).toBe(mockResponseText);
        });

        it('should handle large base64 strings', async () => {
            const largeBase64 = 'A'.repeat(10000);
            const mockResponseText = 'Large image description';

            (mockGenerateContent as any).mockResolvedValue({
                text: mockResponseText,
            });

            const result = await GeminiAPi.callAPI(largeBase64);

            expect(mockGenerateContent).toHaveBeenCalledWith({
                model: 'gemini-3-flash-preview',
                contents: `describe the image in base 64 : ${largeBase64}`,
            });
            expect(result).toBe(mockResponseText);
        });

        it('should construct correct prompt with base64 image', async () => {
            const testBase64 = 'testBase64String';
            const mockResponseText = 'Image contains objects';

            (mockGenerateContent as any).mockResolvedValue({
                text: mockResponseText,
            });

            await GeminiAPi.callAPI(testBase64);

            const expectedPrompt = 'describe the image in base 64 : testBase64String';
            expect(mockGenerateContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    contents: expectedPrompt,
                })
            );
        });

        it('should use correct model name', async () => {
            (mockGenerateContent as any).mockResolvedValue({
                text: 'Response',
            });

            await GeminiAPi.callAPI('image');

            expect(mockGenerateContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    model: 'gemini-3-flash-preview',
                })
            );
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network error');
            (mockGenerateContent as any).mockRejectedValue(networkError);

            const result = await GeminiAPi.callAPI('someimage');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error calling the Gemini API:', networkError);
            expect(result).toBeUndefined();
        });

        it('should handle response with empty text', async () => {
            (mockGenerateContent as any).mockResolvedValue({
                text: '',
            });

            const result = await GeminiAPi.callAPI('image');

            expect(result).toBe('');
            expect(consoleLogSpy).toHaveBeenCalledWith('');
        });

        it('should create GoogleGenAI instance with correct API key', async () => {
            (mockGenerateContent as any).mockResolvedValue({
                text: 'Result',
            });

            await GeminiAPi.callAPI('image');

            expect(GoogleGenAI).toHaveBeenCalledWith({
                apiKey: 'test-api-key',
            });
        });

        it('should handle special characters in base64', async () => {
            const base64WithSpecialChars = 'ABC+/=123';
            const mockResponseText = 'Special image';

            (mockGenerateContent as any).mockResolvedValue({
                text: mockResponseText,
            });

            const result = await GeminiAPi.callAPI(base64WithSpecialChars);

            expect(mockGenerateContent).toHaveBeenCalledWith({
                model: 'gemini-3-flash-preview',
                contents: 'describe the image in base 64 : ABC+/=123',
            });
            expect(result).toBe(mockResponseText);
        });
    });
});
