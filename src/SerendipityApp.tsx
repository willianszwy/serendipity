import React, { useState } from 'react';

// Import our modular architecture
import { CATEGORIES, COLORS } from './constants';
import { Entry } from './types';
import { useEntries, useStats, useModal } from './hooks';
import { 
  Header,
  FloatingButton,
  MonthView,
  LoadingSpinner,
  ErrorDisplay,
  ScoreCard,
  YearlyScoreCard,
  TodayEntries,
  EntryForm
} from './components';

const SerendipityApp: React.FC = () => {
  // Custom hooks for state management
  const {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    clearError
  } = useEntries();

  const {
    dailyStats,
    monthlyStats,
    yearlyStats,
    getMonthEntries
  } = useStats(entries);

  // Local state for UI
  const addModal = useModal();
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Event handlers
  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const handleAddEntry = async (data: any) => {
    const result = await addEntry(data);
    if (result) {
      addModal.close();
    }
  };

  const handleUpdateEntry = async (data: any) => {
    if (!editingEntry) return;
    
    const result = await updateEntry(editingEntry.id, data);
    if (result) {
      setEditingEntry(null);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    await deleteEntry(id);
  };

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setEditingEntry(null); // Clear any active edit modal when navigating to month view
    addModal.close(); // Close add modal if open
  };

  const handleBackFromMonth = () => {
    setSelectedMonth(null);
    setEditingEntry(null); // Clear any active edit modal when returning to main view
  };

  // Debug function to force stats recalculation
  const handleDebugRefresh = () => {
    console.log('=== DEBUG REFRESH ===');
    console.log('Current entries:', entries);
    console.log('Daily stats:', dailyStats);
    console.log('Monthly stats:', monthlyStats);
    
    // Force a re-render by updating the date
    setCurrentDate(new Date());
  };

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={clearError}
        onGoHome={() => window.location.reload()}
        fullScreen
      />
    );
  }

  // Loading state
  if (loading && entries.length === 0) {
    return (
      <LoadingSpinner
        size="large"
        message="Carregando seus acontecimentos..."
        fullScreen
      />
    );
  }

  // Month view
  if (selectedMonth !== null) {
    const monthEntries = getMonthEntries(selectedMonth);
    
    return (
      <>
        <MonthView
          entries={monthEntries}
          categories={CATEGORIES}
          monthIndex={selectedMonth}
          year={currentDate.getFullYear()}
          onBack={handleBackFromMonth}
          onEdit={handleEdit}
          onDelete={handleDeleteEntry}
        />
        
        {/* Edit Entry Modal - render in month view too */}
        {editingEntry && (
          <EntryForm
            entry={editingEntry}
            categories={CATEGORIES}
            onSave={handleUpdateEntry}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        )}
      </>
    );
  }

  // Main app view
  return (
    <div 
      className="min-h-screen font-borel"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* App Header */}
        <Header />

        {/* Daily Score Card */}
        <ScoreCard
          title="Diário"
          stats={dailyStats}
          backgroundColor={COLORS.dailyCard}
          categories={CATEGORIES}
        />

        {/* Monthly Score Card */}
        <ScoreCard
          title="Mensal"
          stats={monthlyStats}
          backgroundColor={COLORS.monthlyCard}
          categories={CATEGORIES}
        />

        {/* Yearly Score Card */}
        <YearlyScoreCard
          yearlyStats={yearlyStats}
          categories={CATEGORIES}
          onMonthClick={handleMonthClick}
          currentYear={currentDate.getFullYear()}
        />

        {/* Today's Entries */}
        <TodayEntries
          entries={entries}
          categories={CATEGORIES}
          onEdit={handleEdit}
          onDelete={handleDeleteEntry}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingButton
        onClick={addModal.open}
        loading={loading}
        variant="add"
      />

      {/* Add Entry Modal */}
      {addModal.isOpen && (
        <EntryForm
          categories={CATEGORIES}
          onSave={handleAddEntry}
          onCancel={addModal.close}
          loading={loading}
        />
      )}

      {/* Edit Entry Modal */}
      {editingEntry && (
        <EntryForm
          entry={editingEntry}
          categories={CATEGORIES}
          onSave={handleUpdateEntry}
          onCancel={handleCancelEdit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SerendipityApp;