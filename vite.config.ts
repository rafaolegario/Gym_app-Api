import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: 'src/utils/tests/clear-test-database.ts', // Carregar a configuração do banco antes dos testes
    globals: true, // Ativar funções globais como beforeAll e afterAll
    testTimeout: 30000, // Evita falhas por timeout
  },
})
