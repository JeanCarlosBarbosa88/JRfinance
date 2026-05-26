# 💰 JRfinance - Aplicativo de Gestão Financeira Pessoal

Um aplicativo mobile completo para controle de finanças pessoais com análises detalhadas, desenvolvido com React Native, Expo e Supabase.

## 📱 Funcionalidades Principais

### 🏠 **Dashboard (Home Screen)**

- **Card de Saldo**: Visualização clara do saldo total, receitas e despesas
- **Transações Recentes**: Exibição das 5 últimas transações
- **Botão de Ação Flutuante (FAB)**: Acesso rápido para adicionar novas transações
- **Logout**: Botão de saída da conta no topo da tela
- **Dark Mode**: Interface otimizada para diferentes temas do dispositivo

### 📊 **Análises (Analytics Screen)**

- **Gráfico de Barras**: Visualização de despesas por dia da semana
- **Gráfico de Rosca**: Distribuição de despesas por categoria
- **Resumo do Período**: Cards com os 4 maiores gastos por categoria
- **Processamento de Dados**: Cálculos automáticos de totais por categoria

### 💸 **Transações (Transactions Screen)**

- Lista completa de todas as transações registradas
- Filtros e buscas avançadas
- Opções de edição e exclusão
- Detalhes descritivos de cada transação

### ⚙️ **Configurações (Settings Screen)**

- Gerenciamento de preferências do usuário
- Opções de tema e idioma
- Configurações de segurança e privacidade

### 🔐 **Autenticação (Login Screen)**

- Login seguro com Supabase Authentication
- Criação de novas contas
- Gerenciamento de sessão de usuário

---

## 🏗️ Arquitetura e Estrutura do Projeto

```
JRfinance/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── constants/           # Constantes da aplicação (cores, categorias)
│   ├── hooks/              # Custom hooks React
│   ├── navigation/         # Configuração de navegação
│   ├── screens/            # Telas principais da app
│   ├── services/           # Serviços de API e armazenamento
│   └── styles/             # Estilos globais e temas
├── assets/                 # Imagens e ícones
├── App.js                  # Arquivo principal da aplicação
├── app.json               # Configuração Expo
└── package.json           # Dependências do projeto
```

---

## 🔧 Componentes Principais

### **App.js** - Arquivo Root

O ponto de entrada da aplicação que:

- Configura o `SafeAreaProvider` para suporte a notch/safe areas
- Define a cor de fundo da aplicação
- Renderiza a barra de status
- Inicializa o `AppNavigator` para gerenciar a navegação

```javascript
// Estrutura básica com suporte a Dark Mode e navegação central
<SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background }}>
  <StatusBar style="light" />
  <AppNavigator />
</SafeAreaProvider>
```

---

## 📁 Componentes (`src/components/`)

### **BalanceCard.js**

Componente que exibe o resumo financeiro:

- Saldo total em destaque
- Receitas (entrada) em verde
- Despesas (saída) em vermelho
- Card elegante com sombras

### **AddTransactionModal.js**

Modal para adicionar novas transações:

- Seletor de tipo (receita/despesa)
- Campo de descrição
- Campo de valor
- Seletor de categoria
- Data automática (ou customizável)

### **TransactionItem.js**

Componente para exibir cada transação:

- Ícone da categoria
- Descrição e valor
- Data formatada
- Botão de exclusão com confirmação
- Cores personalizadas por categoria

### **BarChart.js**

Gráfico de barras das despesas semanais:

- Visualização de gastos por dia da semana
- Escalas automáticas
- Labels formatados em reais (R$)
- Responsivo e interativo

### **DonutChart.js**

Gráfico de rosca das despesas por categoria:

- Porcentagem de cada categoria
- Cores personalizadas
- Legenda com valores
- Facilita visualização de prioridades de gastos

### **CategoryChip.js**

Chip visual para seleção de categorias:

- Ícone e nome da categoria
- Seleção ativa/inativa com feedback visual
- Cores da categoria

### **Header.js**

Cabeçalho reutilizável:

- Título da página
- Ícones customizáveis
- Estilo consistente

### **formatters.js**

Utilitários para formatação:

- Formatação de moeda (R$)
- Formatação de datas em português
- Formatação de números

---

## 🪝 Custom Hooks (`src/hooks/`)

### **useTransactions.js**

Hook para gerenciar todas as operações com transações:

```javascript
const {
  transactions, // Array de transações
  loading, // Estado de carregamento
  addTransaction, // Função para adicionar transação
  deleteTransaction, // Função para deletar transação
  updateTransaction, // Função para atualizar transação
  refreshTransactions, // Função para recarregar dados
} = useTransactions();
```

**Funcionalidades:**

- Carrega transações do Supabase ao inicializar
- Suporta fallback para storage local se offline
- Sincroniza dados automaticamente
- Gerencia estado local com useState

### **useCategories.js**

Hook para gerenciar categorias de transações:

```javascript
const { categories } = useCategories();
```

**Retorna:**

- Array de categorias com id, nome, ícone e cor
- Permite filtragem de transações por categoria

### **useBalance.js**

Hook para calcular saldos financeiros:

```javascript
const { balance, income, expense } = useBalance(transactions);
```

**Cálculos:**

- `balance`: Saldo total (receitas - despesas)
- `income`: Total de receitas
- `expense`: Total de despesas

---

## 🛣️ Navegação (`src/navigation/`)

### **AppNavigator.js**

Gerenciador central de navegação da aplicação:

**Estrutura:**

1. **Stack Navigator**: Gerencia transição entre Login e Main Tabs
2. **Tab Navigator**: Menu de abas inferior com 4 telas principais

**Fluxo:**

```
┌─────────────────────────────────────────┐
│         App Navigator                   │
│  ┌─────────────────────────────────┐   │
│  │    Stack Navigator              │   │
│  │  (Login vs Main Tabs)           │   │
│  └─────────────────────────────────┘   │
│    ↓ (usuário autenticado?)            │
│  ┌─────────────────────────────────┐   │
│  │    Main Tabs Navigator          │   │
│  │  ┌──────┬───────┬──────┬────┐   │   │
│  │  │Home  │Analytics│Trans.│Set.│   │   │
│  │  └──────┴───────┴──────┴────┘   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Recursos:**

- Monitoramento contínuo do estado de autenticação
- Loading spinner durante verificação
- Ícones personalizados para cada aba
- Temas de cores adaptativos
- Animações suaves

---

## 📱 Telas (`src/screens/`)

### **HomeScreen.js**

Dashboard principal da aplicação:

**Componentes:**

- Cabeçalho com saudação e data
- Card de saldo (receitas, despesas, total)
- Lista de 5 transações recentes
- Modal para adicionar novas transações
- FAB (Floating Action Button) estilizado

**Estado:**

- `modalVisible`: Controla visibilidade do modal
- `transactions`: Lista de todas as transações
- `balance`, `income`, `expense`: Cálculos financeiros

### **AnalyticsScreen.js**

Análises e visualizações de dados:

**Componentes:**

- Gráfico de barras (despesas semanais)
- Gráfico de rosca (despesas por categoria)
- Cards com resumo das 4 maiores categorias

**Processamento de Dados:**

- `processExpensesByCategory()`: Agrupa despesas por categoria
- `processWeeklyExpenses()`: Calcula despesas por dia da semana

### **TransactionsScreen.js**

Visualização completa de transações com filtros

### **SettingsScreen.js**

Configurações e preferências do usuário

### **LoginScreen.js**

Autenticação segura:

- Campos de email e senha
- Botões de login e cadastro
- Validação de formulário
- Mensagens de erro

---

## 🔌 Serviços (`src/services/`)

### **supabase.js**

Inicialização do cliente Supabase:

```javascript
export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Credenciais:**

- URL do projeto Supabase
- Chave pública para operações do cliente

### **authService.js**

Serviço de autenticação com Supabase:

```javascript
signUp(email, password); // Criar nova conta
signIn(email, password); // Login do usuário
logOut(); // Logout
getCurrentUser(); // Obter usuário atual
onAuthChange(callback); // Listener de mudanças de auth
```

**Funcionalidades:**

- Gerenciamento seguro de sessões
- Armazenamento local de sessão com AsyncStorage
- Callbacks para mudanças de estado

### **supabaseService.js**

Operações CRUD com o banco Supabase:

```javascript
getTransactions(userId); // Buscar transações do usuário
addTransaction(userId, data); // Criar nova transação
deleteTransaction(id); // Deletar transação
updateTransaction(id, updates); // Atualizar transação
getCategories(); // Buscar categorias disponíveis
```

### **storage.js**

Armazenamento local com AsyncStorage:

```javascript
saveTransactionsLocally(data); // Salvar transações localmente
getTransactionsLocally(); // Recuperar transações locais
clearLocalStorage(); // Limpar storage
```

**Objetivo:** Funcionar offline e sincronizar quando a conexão voltar

---

## 🎨 Constantes e Temas (`src/constants/`)

### **colors.js**

Paleta de cores da aplicação:

```javascript
background; // Cor de fundo (#1a1a1a)
surface; // Cor de superfícies (#2d2d2d)
textPrimary; // Texto principal (#ffffff)
textSecondary; // Texto secundário (#999999)
border; // Bordas (#333333)
accent; // Cor destaque (#00d4ff - ciano)
accentRed; // Vermelho para despesas (#ff4757)
accentGreen; // Verde para receitas (#2ed573)
```

### **categories.js**

Lista de categorias padrão:

```javascript
[
  { id: 1, name: "Alimentação", icon: "🍔", color: "#ff6348" },
  { id: 2, name: "Transporte", icon: "🚗", color: "#ffa502" },
  { id: 3, name: "Saúde", icon: "⚕️", color: "#ee5a6f" },
  // ... mais categorias
];
```

### **theme.js**

Configuração de temas (Dark/Light mode)

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "19.1.0", // Framework principal
    "react-native": "0.81.5", // Desenvolvimento mobile
    "expo": "~54.0.33", // Plataforma de build
    "@react-navigation/native": "^7.1.8", // Navegação
    "@supabase/supabase-js": "^2.104.1", // Backend BaaS
    "react-native-chart-kit": "^6.12.0", // Gráficos
    "@react-native-async-storage/async-storage": "^2.2.0", // Storage local
    "@expo/vector-icons": "^15.0.3" // Ícones
  }
}
```

---

## 🚀 Como Usar

### Instalação

```bash
# Clonar repositório
git clone https://github.com/JeanCarlosBarbosa88/JRfinance.git
cd JRfinance

# Instalar dependências
npm install
# ou
yarn install

# Instalar Expo CLI (se não tiver)
npm install -g expo-cli
```

### Iniciar a Aplicação

```bash
# Iniciar o Expo development server
npm start

# Abrir no Android
npm run android

# Abrir no iOS
npm run ios

# Abrir na web
npm run web
```

### Configurar Supabase

1. Crie uma conta em [supabase.io](https://supabase.io)
2. Crie um novo projeto
3. Configure as tabelas:
   - `users` (criada automaticamente por auth)
   - `transactions` (com fields: id, user_id, type, amount, description, category_id, date)
   - `categories` (com fields: id, name, icon, color)
4. Atualize as credenciais em `src/services/supabase.js`

---

## 🔄 Fluxo de Dados

### Adicionar Transação

```
HomeScreen (estado local)
    ↓
AddTransactionModal (form)
    ↓
useTransactions.addTransaction()
    ↓
supabaseService.addTransaction()
    ↓
Supabase Database
    ↓
storage.saveTransactionsLocally()
    ↓ (atualiza estado)
HomeScreen re-renderiza
```

### Carregar Transações

```
App inicia
    ↓
AppNavigator verifica auth
    ↓
useTransactions hook inicializa
    ↓
supabaseService.getTransactions()
    ↓
Supabase Database
    ↓
storage.saveTransactionsLocally() (fallback)
    ↓
setTransactions (setState)
    ↓
Componentes recebem dados via props
```

---

## 🎯 Principais Funcionalidades Técnicas

### ✅ **Sincronização Offline-First**

- Dados salvos localmente com AsyncStorage
- Sincronização automática quando online
- Funciona completamente offline

### ✅ **Autenticação Segura**

- Supabase Auth com JWT
- Sessões persistentes
- Logout seguro com limpeza de dados

### ✅ **Responsividade**

- Suporte a Safe Areas (notch, home indicator)
- Layout flexível para diferentes tamanhos
- Temas adaptativos (Dark/Light)

### ✅ **Performance**

- Lazy loading de componentes
- Memoização com useCallback
- Paginação de transações

### ✅ **UX Intuitiva**

- Loading states em todas as operações
- Feedback visual (toast, modals)
- Swipe para deletar transações
- FAB para ação principal

---

## 🐛 Resolução de Problemas

### Aplicação não carrega transações

1. Verifique conexão com internet
2. Verifique credenciais do Supabase
3. Verifique tabelas do banco de dados

### Login não funciona

1. Verifique email/senha corretos
2. Confirme confirmação de email (se necessário)
3. Verifique configurações de autenticação no Supabase

### AsyncStorage errors

1. Limite de storage atingido
2. Limpe cache do dispositivo
3. Atualize versão do React Native

---

## 📝 Scripts Disponíveis

```bash
npm start          # Iniciar development server Expo
npm run android    # Build e abrir no Android
npm run ios        # Build e abrir no iOS
npm run web        # Build e abrir na web
npm run lint       # Executar linter (ESLint)
npm run reset-project  # Resetar estrutura do projeto
```

---

## 🤝 Contribuindo

Sinta-se livre para fazer fork e submeter pull requests com melhorias!

---

## 📄 Licença

Este projeto é de código aberto. Use livremente para fins pessoais e comerciais.

---

## 👨‍💻 Autor

**Jean Carlos Barbosa**  
GitHub: [@JeanCarlosBarbosa88](https://github.com/JeanCarlosBarbosa88)

---

## 🙏 Agradecimentos

- [Expo](https://expo.io) - Plataforma de desenvolvimento
- [React Native](https://reactnative.dev) - Framework mobile
- [Supabase](https://supabase.io) - Backend e autenticação
- [React Navigation](https://reactnavigation.org) - Sistema de navegação

---

**Última atualização:** Maio 2026  
**Versão:** 1.0.0
