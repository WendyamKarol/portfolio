'use client';

import { useCallback, useReducer } from 'react';
import type { CareerStep, Locale } from '@/types/portfolio';

export type PlayerMode = 'idle' | 'intro' | 'playing' | 'paused' | 'detail' | 'completed';

export interface CareerPlayerState {
  currentIndex: number;
  mode: PlayerMode;
  locale: Locale;
}

export type CareerPlayerAction =
  | { type: 'START' }
  | { type: 'SKIP_INTRO' }
  | { type: 'INTRO_DONE' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'PREV' }
  | { type: 'NEXT' }
  | { type: 'RESTART' }
  | { type: 'GO_TO_STEP'; index: number }
  | { type: 'OPEN_DETAIL'; index?: number }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'COMPLETE' }
  | { type: 'SET_LOCALE'; locale: Locale };

function reducer(
  state: CareerPlayerState,
  action: CareerPlayerAction,
  stepCount: number,
): CareerPlayerState {
  const lastIndex = Math.max(0, stepCount - 1);

  switch (action.type) {
    case 'START':
      return { ...state, mode: 'intro', currentIndex: 0 };
    case 'SKIP_INTRO':
      return { ...state, mode: 'playing', currentIndex: 0 };
    case 'INTRO_DONE':
      return { ...state, mode: 'playing', currentIndex: 0 };
    case 'PLAY':
      if (state.mode === 'completed') {
        return { ...state, mode: 'playing', currentIndex: 0 };
      }
      return { ...state, mode: 'playing' };
    case 'PAUSE':
      if (state.mode === 'playing') {
        return { ...state, mode: 'paused' };
      }
      return state;
    case 'PREV':
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
        mode: state.mode === 'detail' ? 'detail' : 'paused',
      };
    case 'NEXT':
      if (state.currentIndex >= lastIndex) {
        return { ...state, mode: 'completed', currentIndex: lastIndex };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        mode: state.mode === 'detail' ? 'detail' : 'playing',
      };
    case 'RESTART':
      return { ...state, currentIndex: 0, mode: 'intro' };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentIndex: Math.min(Math.max(0, action.index), lastIndex),
        mode: 'paused',
      };
    case 'OPEN_DETAIL':
      return {
        ...state,
        currentIndex: action.index ?? state.currentIndex,
        mode: 'detail',
      };
    case 'CLOSE_DETAIL':
      return { ...state, mode: 'paused' };
    case 'COMPLETE':
      return { ...state, mode: 'completed', currentIndex: lastIndex };
    case 'SET_LOCALE':
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}

export function useCareerPlayer(steps: CareerStep[]) {
  const stepCount = steps.length;

  const [state, dispatchBase] = useReducer(
    (s: CareerPlayerState, a: CareerPlayerAction) => reducer(s, a, stepCount),
    { currentIndex: 0, mode: 'idle' as PlayerMode, locale: 'fr' as Locale },
  );

  const dispatch = useCallback(
    (action: CareerPlayerAction) => dispatchBase(action),
    [],
  );

  const currentStep = steps[state.currentIndex] ?? steps[0];

  const start = useCallback(() => dispatch({ type: 'START' }), [dispatch]);
  const skipIntro = useCallback(() => dispatch({ type: 'SKIP_INTRO' }), [dispatch]);
  const introDone = useCallback(() => dispatch({ type: 'INTRO_DONE' }), [dispatch]);
  const play = useCallback(() => dispatch({ type: 'PLAY' }), [dispatch]);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [dispatch]);
  const prev = useCallback(() => dispatch({ type: 'PREV' }), [dispatch]);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [dispatch]);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [dispatch]);
  const goToStep = useCallback(
    (index: number) => dispatch({ type: 'GO_TO_STEP', index }),
    [dispatch],
  );
  const openDetail = useCallback(
    (index?: number) => dispatch({ type: 'OPEN_DETAIL', index }),
    [dispatch],
  );
  const closeDetail = useCallback(() => dispatch({ type: 'CLOSE_DETAIL' }), [dispatch]);
  const complete = useCallback(() => dispatch({ type: 'COMPLETE' }), [dispatch]);
  const setLocale = useCallback(
    (locale: Locale) => dispatch({ type: 'SET_LOCALE', locale }),
    [dispatch],
  );

  return {
    ...state,
    currentStep,
    stepCount,
    dispatch,
    start,
    skipIntro,
    introDone,
    play,
    pause,
    prev,
    next,
    restart,
    goToStep,
    openDetail,
    closeDetail,
    complete,
    setLocale,
    isPlaying: state.mode === 'playing',
    isPaused: state.mode === 'paused' || state.mode === 'idle',
    showDetail: state.mode === 'detail',
  };
}

export type CareerPlayer = ReturnType<typeof useCareerPlayer>;
