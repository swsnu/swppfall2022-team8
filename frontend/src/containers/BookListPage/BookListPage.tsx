import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import QueryString from 'qs'

import BookListEntity from '../../components/BookListEntity/BookListEntity'
import SearchBar from '../../components/SearchBar/SearchBar'
import { AppDispatch } from '../../store'
import { fetchQueryLends, selectLend } from '../../store/slices/lend/lend'

import './BookListPage.css'
import PageButton from '../../components/PageButton/PageButton'

const BookListPage = () => {
  const { search } = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const lendState = useSelector(selectLend)

  const params = QueryString.parse(search, { ignoreQueryPrefix: true })

  useEffect(() => {
    dispatch(fetchQueryLends(params))
  }, [search, dispatch])

  const pageClickHandler = (page: number) => {
    params.page = String(page)
    navigate(`/search?${QueryString.stringify(params)}`)
    window.scrollTo(0, 0)
  }

  return (
    <div className='page'>
      <br />
      <br />
      <br />

      <SearchBar {...params} />
      <br />
      <h3><b>Result</b></h3>
      <div className='booklist'>
        {lendState.lends.length
          ? lendState.lends.map(lend => (
            <div key={`lendlist_${lend.id}`} className='booklist-item'>
              <BookListEntity
                id={lend.id}
                title={lend.book_info.title}
                image={lend.book_info.image}
                owner={lend.owner_username}
                available={lend.status === null}
              />
            </div>
          ))
          : <h5 className='empty-text'></h5>
        }
      </div>
      <div>
        <div className='page-button'>
          <PageButton
            currPage={params.page ? Number(params.page) : 1}
            numPage={Math.ceil(lendState.count / 12)}
            handleClick={pageClickHandler}
          />
        </div>
      </div>
    </div>
  )
}

export default BookListPage
