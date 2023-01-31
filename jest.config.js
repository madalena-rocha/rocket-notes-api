module.exports = {
  bail: true, 
  // o bail vem desligado por padrão, se um teste falhar, ele para de executar os testes
  // se o bail não tiver como true, se um teste falhar, ele continua executando os outros
  coverageProvider: "v8",

  testMatch: [
    "<rootDir>/src/**/*.spec.js" // expressão regular para o padrão dos arquivos de teste
    // dentro de qualquer pasta, um arquivo com qualquer nome, cuja extensão seja .spec.js
    // ignorar a pasta node_modules, consequentemente os testes rodam mais ráido
    // <rootDir>/src/ para partir da raiz do projeto, dentro da pasta src
  ],
}