import { create } from 'zustand';

interface FinanceState {
  currentMonth: number;
  currentYear: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  currentMonth: new Date().getMonth() + 1,
  currentYear: new Date().getFullYear(),
  setMonth: (month) => set({ currentMonth: month }),
  setYear: (year) => set({ currentYear: year }),
  nextMonth: () => set((state) => {
    if (state.currentMonth === 12) {
      return { currentMonth: 1, currentYear: state.currentYear + 1 };
    }
    return { currentMonth: state.currentMonth + 1 };
  }),
  prevMonth: () => set((state) => {
    if (state.currentMonth === 1) {
      return { currentMonth: 12, currentYear: state.currentYear - 1 };
    }
    return { currentMonth: state.currentMonth - 1 };
  }),
}));
