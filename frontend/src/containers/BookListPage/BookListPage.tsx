import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'

import BookListEntity from '../../components/BookListEntity/BookListEntity'
import ChattingButton from '../../components/ChattingButton/ChattingButton'
import LogoButton from '../../components/LogoButton/LogoButton'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import SearchBar from '../../components/SearchBar/SearchBar'
import UserStatusButton from '../../components/UserStatusButton/UserStatusButton'
import { AppDispatch } from '../../store'
import { fetchQueryLends, selectLend } from '../../store/slices/lend/lend'

const BookListPage = () => {
  const { key } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const lendState = useSelector(selectLend)

  useEffect(() => {
    dispatch(fetchQueryLends({ title: key }))
  }, [key, dispatch])

  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <UserStatusButton />
      <LogoutButton />
      <br />
      <h1>BookListPage</h1>
      <br />

      <SearchBar initContent={key ?? ''} />
      <p>Search Result about &quot;{key}&quot;</p>
      {lendState.lends.map(lend => (
        <div key={`lendlist_${lend.id}`}>
          <BookListEntity
            id={lend.id}
            title={lend.book_info.title}
          />
        </div>
      ))}
    </>
  )
}

export default BookListPage
