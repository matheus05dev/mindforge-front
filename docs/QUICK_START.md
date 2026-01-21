# ⚡ Quick Start: MindForge API

Guia acelerado para levantar o ambiente de desenvolvimento completo (Frontend + Backend).

## ✅ Checklist de Inicialização

1. **Backend**:
    - [ ] Certifique-se que o backend está rodando na porta `8080`.
    - [ ] Banco de dados está acessível.

2. **Frontend**:
    - [ ] Dependências instaladas: `npm install`
    - [ ] Variável de ambiente configurada: `NEXT_PUBLIC_API_URL` apontando para o backend.

3. **Verificação**:
    Ao rodar `npm run dev` e acessar `localhost:3000`, o dashboard deve carregar sem erros vermelhos no console do navegador.

## 🔍 Teste de Conectividade

Se o dashboard não carregar dados, rode este comando no terminal para diagnosticar a API:

```bash
# Testar endpoint de saúde (ou listagem básica)
curl -v http://localhost:8080/api/workspaces
```

**Resposta esperada:** JSON válido (mesmo que array vazio) e HTTP 200.

## 🆘 Suporte

Se encontrar problemas de integração:
1. Verifique a aba **Network** do DevTools.
2. Confirme se as rotas no `lib/api/config.ts` coincidem com o backend.
3. Consulte `docs/API_INTEGRATION.md` para detalhes avançados.
