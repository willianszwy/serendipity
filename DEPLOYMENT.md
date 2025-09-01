# 🚀 Deployment Guide - Serendipity PWA

## GitHub Pages Deployment

Este guia explica como fazer deploy do app Serendipity no GitHub Pages.

### 📋 Pré-requisitos

1. **Repositório GitHub**: Ter o código em um repositório GitHub
2. **Node.js**: Versão 18 ou superior
3. **npm**: Para instalar dependências

### 🔧 Configuração Inicial

#### 1. Atualizar a URL do Projeto

No arquivo `package.json`, substitua `USERNAME` pelo seu username do GitHub e `serendipity` pelo nome do seu repositório:

```json
{
  "homepage": "https://SEU_USERNAME.github.io/NOME_DO_SEU_REPOSITORIO"
}
```

**Exemplo:**
```json
{
  "homepage": "https://willians.github.io/serendipity"
}
```

#### 2. Configurar GitHub Pages

1. Vá para o seu repositório no GitHub
2. Clique em **Settings**
3. Role até **Pages** no menu lateral
4. Em **Source**, selecione **GitHub Actions**

### 🚀 Opções de Deploy

#### Opção 1: Deploy Automático (Recomendado)

O deploy acontece automaticamente quando você faz push para a branch `main`:

1. **Faça commit das suas mudanças:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Aguarde o workflow:**
   - Vá para **Actions** no seu repositório
   - Aguarde o workflow "Deploy to GitHub Pages" completar
   - O site estará disponível em `https://SEU_USERNAME.github.io/NOME_DO_REPOSITORIO`

#### Opção 2: Deploy Manual

Para fazer deploy manual a qualquer momento:

```bash
# Instalar dependências
npm install

# Fazer deploy
npm run deploy
```

### 📱 Verificar o Deploy

Após o deploy bem-sucedido:

1. **Acesse o site:** `https://SEU_USERNAME.github.io/NOME_DO_REPOSITORIO`
2. **Teste as funcionalidades:**
   - ✅ Adicionar nova entrada
   - ✅ Editar entradas existentes
   - ✅ Visualizar estatísticas
   - ✅ Navegação por meses
   - ✅ Persistência de dados (localStorage)

### 🐛 Troubleshooting

#### Página em branco ou 404

1. **Verificar a URL do homepage** no `package.json`
2. **Conferir se o GitHub Pages está ativo** nas configurações
3. **Aguardar alguns minutos** - o deploy pode demorar

#### Assets não carregam

1. **Verificar se a URL base está correta** no `package.json`
2. **Fazer um novo deploy:**
   ```bash
   npm run deploy
   ```

#### Workflow falhando

1. **Verificar se as Actions estão habilitadas** no repositório
2. **Conferir os logs** na aba Actions
3. **Verificar se todas as dependências estão no `package.json`**

### 📁 Estrutura de Deploy

```
build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
├── 404.html          # Para SPAs
└── manifest.json
```

### 🔄 Atualizações

Para atualizar o site:

1. **Fazer mudanças no código**
2. **Commit e push para main** (deploy automático)
   ```bash
   git add .
   git commit -m "Update: descrição das mudanças"
   git push origin main
   ```

OU

3. **Deploy manual:**
   ```bash
   npm run deploy
   ```

### 📝 Scripts Disponíveis

- `npm start` - Desenvolvimento local
- `npm run build` - Build para produção
- `npm run deploy` - Deploy manual para GitHub Pages
- `npm test` - Executar testes

### 🎯 Performance

O app está otimizado para GitHub Pages com:

- ✅ **Build otimizado** com React Scripts
- ✅ **Assets comprimidos** (gzip)
- ✅ **PWA ready** com service worker
- ✅ **SPA routing** configurado para GitHub Pages
- ✅ **Caching** automático de assets

---

## 🌟 URL Final

Após configurar corretamente, seu app estará disponível em:
**`https://SEU_USERNAME.github.io/NOME_DO_REPOSITORIO`**

🎉 **Pronto! Seu Serendipity PWA está no ar!**