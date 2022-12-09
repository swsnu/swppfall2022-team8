import { screen, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import Recommend from './Recommend'

const fakeRecommend = {
  id: 291354,
  image: '/media/291354/book_291354.jpg',
  title: 'The Ruby Knight (The Elenium, #2)',
  author: 'David Eddings',
  tags: [
    'fantasy'
  ],
  brief: 'The Ruby Knight'
}

const preloadedState: RootState = {
  ...rootInitialState,
  user: {
    ...rootInitialState.user,
    recommend: {
      is_queued: true,
      is_outdated: true,
      enqueued: true,
      recommend_list: [fakeRecommend]
    }
  }
}

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}))

const spyRecommendEntity = () => (
  <div data-testid='spyRecommendEntity'>spyRecommendEntity</div>
)
jest.mock('../RecommendEntity/RecommendEntity', () => spyRecommendEntity)

describe('<Recommend />', () => {
  it('should handle auto fetch', async () => {
    // given
    jest.useFakeTimers()
    renderWithProviders(<Recommend />, { preloadedState })

    // when
    jest.runOnlyPendingTimers()

    // then
    await screen.findByText('Calculating in progress with changed tags...')
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled())
  })
  it('should render when not outdated and no recommend_list', async () => {
    // given
    renderWithProviders(<Recommend />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          recommend: {
            ...preloadedState.user.recommend,
            is_outdated: false,
            recommend_list: []
          }
        }
      }
    })

    // then
    await screen.findByText('Please add your preference tag to use recommend system!')
  })
  it('should render when not outdated and recommend_list not empty', async () => {
    // given
    jest.useFakeTimers()
    renderWithProviders(<Recommend />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          recommend: {
            ...preloadedState.user.recommend,
            is_outdated: false
          }
        }
      }
    })
    const recommendentity = screen.getByTestId('spyRecommendEntity')

    // when
    jest.runOnlyPendingTimers()

    // then
    expect(recommendentity.innerHTML).toEqual('spyRecommendEntity')
  })
})
