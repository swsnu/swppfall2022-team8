import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import QueryString from 'qs'

import BookListEntity from '../../components/BookListEntity/BookListEntity'
import NavBar from '../../components/NavBar/NavBar'
import SearchBar from '../../components/SearchBar/SearchBar'
import { AppDispatch } from '../../store'
import { fetchQueryLends, selectLend } from '../../store/slices/lend/lend'

import './BookListPage.css'

const BookListPage = () => {
  const { search } = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const lendState = useSelector(selectLend)

  useEffect(() => {
    dispatch(fetchQueryLends(QueryString.parse(search, { ignoreQueryPrefix: true })))
  }, [search, dispatch])

  return (
    <div className='page'>
      <NavBar />
      <h1>BookListPage</h1>
      <br />

      <SearchBar {...QueryString.parse(search, { ignoreQueryPrefix: true })} />
      <br />
      <h3>Result</h3>
      <div className='booklist'>
        {lendState.lends.map(lend => (
          <div key={`lendlist_${lend.id}`} className='booklist-item'>
            <BookListEntity
              id={lend.id}
              title={lend.book_info.title}
              image={lend.book_info.image}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookListPage
