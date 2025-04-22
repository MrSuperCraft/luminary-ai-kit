import { create } from 'zustand';

type ChatState = {
    finishedMessages: Set<string>;
    toolStartedMessages: Set<string>;
    toolFinishedMessages: Set<string>;
    shownSources: Set<string>;
    toolCallsStarted: Set<string>;
    toolCallsFinished: Set<string>;

    markMessageFinished: (id: string) => void;
    markToolStarted: (id: string) => void;
    markToolFinished: (id: string) => void;
    markSourcesShown: (id: string) => void;
    markToolCallStarted: (callId: string) => void;
    markToolCallFinished: (callId: string) => void;

    reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
    finishedMessages: new Set(),
    toolStartedMessages: new Set(),
    toolFinishedMessages: new Set(),
    shownSources: new Set(),
    toolCallsStarted: new Set(),
    toolCallsFinished: new Set(),

    markToolCallStarted: (callId) =>
        set((s) => ({
            toolCallsStarted: new Set(s.toolCallsStarted).add(callId),
        })),
    markToolCallFinished: (callId) =>
        set((s) => ({
            toolCallsFinished: new Set(s.toolCallsFinished).add(callId),
        })),

    markMessageFinished: (id) =>
        set((state) => ({
            finishedMessages: new Set(state.finishedMessages).add(id),
        })),

    markToolStarted: (id) =>
        set((state) => ({
            toolStartedMessages: new Set(state.toolStartedMessages).add(id),
        })),

    markToolFinished: (id) =>
        set((state) => ({
            toolFinishedMessages: new Set(state.toolFinishedMessages).add(id),
        })),

    markSourcesShown: (id) =>
        set((state) => ({
            shownSources: new Set(state.shownSources).add(id),
        })),

    reset: () =>
        set({
            finishedMessages: new Set(),
            toolStartedMessages: new Set(),
            toolFinishedMessages: new Set(),
            shownSources: new Set(),
        }),
}));
