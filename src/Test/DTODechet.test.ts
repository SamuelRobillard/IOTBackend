import { describe, it, expect } from '@jest/globals';
import DTODechet from '../model/DTODechet';
import { categorieAnalyserDechet } from '../model/Dechet';
import { categorieJeter } from '../model/Verification';

describe('DTODechet', () => {
    it('should create an instance of DTODechet with the right properties', () => {
        const idDechet = '12345';
        const categorieAnalyser = categorieAnalyserDechet.Recyclage;
        const categorieJeter = 'verre' as categorieJeter;
        const date = '2023-10-10';

        const dtoDechet = new DTODechet(idDechet, categorieAnalyser, categorieJeter, date);

        expect(dtoDechet).toBeInstanceOf(DTODechet);
        expect(dtoDechet.idDechet).toBe(idDechet);
        expect(dtoDechet.categorieAnalyser).toBe(categorieAnalyser);
        expect(dtoDechet.categorieJeter).toBe(categorieJeter);
        expect(dtoDechet.date).toBe(date);
    });

    it('should be able to have  empty idDechet', () => {
        const idDechet = '';
        const categorieAnalyser = categorieAnalyserDechet.Recyclage;
        const categorieJeter = 'verre' as categorieJeter;
        const date = '2023-10-10';

        const dtoDechet = new DTODechet(idDechet, categorieAnalyser, categorieJeter, date);

        expect(dtoDechet.idDechet).toBe('');
        expect(dtoDechet.categorieAnalyser).toBe(categorieAnalyser);
        expect(dtoDechet.categorieJeter).toBe(categorieJeter);
        expect(dtoDechet.date).toBe(date);
    });

    it('should be able to have null categorieAnalyser', () => {
        const idDechet = '12345';
        const categorieAnalyser = null as any;
        const categorieJeter = 'verre' as categorieJeter;
        const date = '2023-10-10';

        const dtoDechet = new DTODechet(idDechet, categorieAnalyser, categorieJeter, date);

        expect(dtoDechet.categorieAnalyser).toBeNull();
        expect(dtoDechet.idDechet).toBe(idDechet);
        expect(dtoDechet.categorieJeter).toBe(categorieJeter);
        expect(dtoDechet.date).toBe(date);
    });

    it('should be able to have null categorieJeter', () => {
        const idDechet = '12345';
        const categorieAnalyser = categorieAnalyserDechet.Recyclage;
        const categorieJeter = null as any;
        const date = '2023-10-10';

        const dtoDechet = new DTODechet(idDechet, categorieAnalyser, categorieJeter, date);

        expect(dtoDechet.categorieJeter).toBeNull();
        expect(dtoDechet.idDechet).toBe(idDechet);
        expect(dtoDechet.categorieAnalyser).toBe(categorieAnalyser);
        expect(dtoDechet.date).toBe(date);
    });

    it('should be hable to have empty date', () => {
        const idDechet = '12345';
        const categorieAnalyser = categorieAnalyserDechet.Recyclage;
        const categorieJeter = 'verre' as categorieJeter;
        const date = '';

        const dtoDechet = new DTODechet(idDechet, categorieAnalyser, categorieJeter, date);

        expect(dtoDechet.date).toBe('');
        expect(dtoDechet.idDechet).toBe(idDechet);
        expect(dtoDechet.categorieAnalyser).toBe(categorieAnalyser);
        expect(dtoDechet.categorieJeter).toBe(categorieJeter);
    });

    it('should be able to have  null properties', () => {
        const dtoDechet = new DTODechet(null as any, null as any, null as any, null as any);

        expect(dtoDechet.idDechet).toBeNull();
        expect(dtoDechet.categorieAnalyser).toBeNull();
        expect(dtoDechet.categorieJeter).toBeNull();
        expect(dtoDechet.date).toBeNull();
    });

    it('should not throw an error for null or empty values', () => {
        expect(() => {
            new DTODechet('12345', categorieAnalyserDechet.Recyclage, null as any, '2023-10-10');
        }).not.toThrow();

        expect(() => {
            new DTODechet('12345', categorieAnalyserDechet.Recyclage, 'verre' as categorieJeter, '');
        }).not.toThrow();
    });
});