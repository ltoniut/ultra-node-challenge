module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    moduleNameMapper: {
      '^src[/](.*)': '<rootDir>/$1',
    },
    testRegex: '.e2e-spec.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    modulePaths:  [ '<rootDir>' ],
    testPathIgnorePatterns: ['/node_modules/', '_template'],
  };
  