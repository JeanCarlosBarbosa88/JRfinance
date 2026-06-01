import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function App() {
  const [transactions, setTransactions] = React.useState([
    { id: '1', title: 'Café', amount: 5.50, type: 'expense', date: '2024-06-01' },
    { id: '2', title: 'Salário', amount: 3000, type: 'income', date: '2024-06-01' },
  ]);
  const [amount, setAmount] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('expense');

  const addTransaction = () => {
    if (!title || !amount) {
      alert('Preencha título e valor');
      return;
    }
    const newTransaction = {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTransaction, ...transactions]);
    setTitle('');
    setAmount('');
    setType('expense');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <SafeAreaProvider>
      <MainContent
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        addTransaction={addTransaction}
        title={title}
        setTitle={setTitle}
        amount={amount}
        setAmount={setAmount}
        type={type}
        setType={setType}
        balance={balance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />
    </SafeAreaProvider>
  );
}

function MainContent({
  transactions,
  deleteTransaction,
  addTransaction,
  title,
  setTitle,
  amount,
  setAmount,
  type,
  setType,
  balance,
  totalIncome,
  totalExpense,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>JRfinance</Text>
        <Text style={styles.subtitle}>Suas Finanças</Text>
      </View>

      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={[styles.balanceAmount, balance >= 0 ? styles.positive : styles.negative]}>
            R$ {balance.toFixed(2)}
          </Text>
        </View>
        <View style={styles.balanceSplit}>
          <View>
            <Text style={styles.smallLabel}>Entrada</Text>
            <Text style={styles.positiveText}>+R$ {totalIncome.toFixed(2)}</Text>
          </View>
          <View>
            <Text style={styles.smallLabel}>Saída</Text>
            <Text style={styles.negativeText}>-R$ {totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>Adicionar Transação</Text>

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Valor"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
            onPress={() => setType('expense')}
          >
            <Text style={styles.typeBtnText}>Despesa 💸</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]}
            onPress={() => setType('income')}
          >
            <Text style={styles.typeBtnText}>Receita 💰</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addTransaction}>
          <Text style={styles.addBtnText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listTitle}>Transações</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[styles.transactionAmount, item.type === 'income' ? styles.positiveText : styles.negativeText]}>
                {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação</Text>}
        scrollEnabled={true}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  positive: {
    color: '#4ade80',
  },
  negative: {
    color: '#f87171',
  },
  positiveText: {
    color: '#4ade80',
  },
  negativeText: {
    color: '#f87171',
  },
  balanceSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  formSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  transactionDate: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  deleteBtn: {
    color: '#f87171',
    fontSize: 20,
    padding: 4,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
