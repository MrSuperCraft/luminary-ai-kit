import { create } from 'zustand';
import { persist } from 'zustand/middleware'



export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
    // modal open/close
    isOpen: boolean;
    openSettings: () => void;
    closeSettings: () => void;
    setOpen: (open: boolean) => void;

    // user‐facing toggles
    theme: Theme;
    setTheme: (theme: Theme) => void;

    streaming: boolean;
    toggleStreaming: () => void;

    showTokenCount: boolean;
    toggleShowTokenCount: () => void;

    showSources: boolean;
    toggleShowSources: () => void;

    markdownEnabled: boolean;
    toggleMarkdown: () => void;

    // developer mode
    developerMode: boolean;
    toggleDeveloperMode: () => void;

    model: string;
    setModel: (model: string) => void;

    temperature: number;
    setTemperature: (temp: number) => void;
}
export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // modal
            isOpen: false,
            openSettings: () => set({ isOpen: true }),
            closeSettings: () => set({ isOpen: false }),
            setOpen: (open) => set({ isOpen: open }),

            // core UI options
            theme: 'system',
            setTheme: (theme) => set({ theme }),

            streaming: true,
            toggleStreaming: () => set((s) => ({ streaming: !s.streaming })),

            showTokenCount: false,
            toggleShowTokenCount: () => set((s) => ({ showTokenCount: !s.showTokenCount })),

            showSources: true,
            toggleShowSources: () => set((s) => ({ showSources: !s.showSources })),

            markdownEnabled: true,
            toggleMarkdown: () => set((s) => ({ markdownEnabled: !s.markdownEnabled })),

            // developer mode
            developerMode: false,
            toggleDeveloperMode: () => set((s) => ({ developerMode: !s.developerMode })),

            model: 'deepseek-r1-distill-llama-70b',
            setModel: (model) => set({ model }),

            temperature: 0.7,
            setTemperature: (temperature) => set({ temperature }),
        }),
        {
            name: 'settings-storage', // unique name for localStorage
        }
    )
);
