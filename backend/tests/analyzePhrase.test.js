"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("../cli");
describe('Test analyzePhrase function', () => {
    let consoleSpy;
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        consoleSpy.mockRestore();
    });
    it('should find matching words at the correct depth', () => {
        const phrase = "Eu vi tigres e papagaios";
        const depth = 3;
        const verbose = false;
        (0, cli_1.analyzePhrase)(phrase, depth, verbose);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Felinos = 1; Passaros = 1'));
    });
    it('should return 0 if no matches are found', () => {
        const phrase = "Eu tenho preferência por animais marinhos";
        const depth = 5;
        const verbose = false;
        (0, cli_1.analyzePhrase)(phrase, depth, verbose);
        expect(consoleSpy).toHaveBeenCalledWith('0');
    });
    it('should show verbose output', () => {
        const phrase = "Eu vi tigres e papagaios";
        const depth = 3;
        const verbose = true;
        (0, cli_1.analyzePhrase)(phrase, depth, verbose);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Tempo de carregamento dos parâmetros'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Tempo de verificação da frase'));
    });
    it('should analyze a text with more than 5000 characters', () => {
        const longText = "Eu vi tigres e papagaios ".repeat(250);
        const depth = 3;
        const verbose = false;
        (0, cli_1.analyzePhrase)(longText, depth, verbose);
        expect(consoleSpy).toHaveBeenCalled();
    });
});
