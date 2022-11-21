import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import { render, RenderOptions } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { AppStore, RootState } from '../store'
import bookReducer from '../store/slices/book/book'
import lendReducer from '../store/slices/lend/lend'
import borrowReducer from '../store/slices/borrow/borrow'
import userReducer from '../store/slices/user/user'
import roomReducer from '../store/slices/room/room'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
};

export const rootInitialState: RootState = {
  book: {
    books: [],
    selectedBook: null
  },
  lend: {
    lends: [],
    userLends: [],
    selectedLend: null
  },
  borrow: {
    userBorrows: [],
    selectedBorrow: null
  },
  user: {
    currentUser: null,
    subscribed_tags: [],
    watch_list: [],
    recommend_list: []
  },
  room: {
    next: null,
    prev: null,
    rooms: [],
    selectedRoom: null
  }
}

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      book: bookReducer,
      lend: lendReducer,
      borrow: borrowReducer,
      user: userReducer,
      room: roomReducer
    },
    preloadedState
  })
}

export function renderWithProviders (
  ui: React.ReactElement,
  {
    preloadedState,
    store = getMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper ({ children }: PropsWithChildren): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
