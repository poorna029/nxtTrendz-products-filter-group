import {FiSearch} from 'react-icons/fi'

import './index.css'

const FiltersGroup = props => {
  const {
    ratingsList,
    categoryOptions,
    inputEleFn,
    ratingFn,
    categoryFn,
    resetFn,
    activeCategoryId,
    activeRatingId,
  } = props
  console.log(ratingsList, categoryOptions)

  const inputChange = e => {
    console.log(e.target.value)
    if (e.key === 'Enter') {
      inputEleFn(e.target.value)
    }
  }

  const click = e => {
    const text = e.target.innerText
    console.log(e.target.key)
    const obj = categoryOptions.filter(p => p.name === text)
    const {categoryId} = obj[0]
    categoryFn(categoryId)
    console.log(categoryId)
  }

  function ratingPointer(e) {
    const obj = ratingsList.filter(p => p.imageUrl === e.target.src)
    const {ratingId} = obj[0]
    console.log(ratingId)
    ratingFn(ratingId)
  }

  const reset = () => {
    resetFn()
  }

  return (
    <ul className="filters-group-container">
      <div className="input-container">
        <input
          type="search"
          placeholder="search"
          className="in"
          onKeyUp={inputChange}
        />
        <FiSearch className="search" />
      </div>
      <h1>Category</h1>
      {/* Replace this element with your code */}
      <ul className="ili" onClick={click}>
        {categoryOptions.map(e => (
          <li
            className={`li ${
              activeCategoryId === e.categoryId ? 'active' : null
            }`}
            key={e.categoryId}
          >
            <p> {e.name}</p>
          </li>
        ))}
      </ul>
      <h1>Rating</h1>
      {ratingsList.map(e => (
        <div key={e.ratingId}>
          <button
            type="button"
            className={`container ${
              activeRatingId === e.ratingId ? 'active-rating' : null
            }`}
            onClick={ratingPointer}
          >
            <div>
              <img
                src={e.imageUrl}
                alt={`rating ${e.ratingId}`}
                className="rating"
              />
              <span>& up</span>
            </div>
          </button>
        </div>
      ))}
      <div className="simple">
        <button type="submit" className="but" onClick={reset}>
          Clear Filters
        </button>
      </div>
    </ul>
  )
}
export default FiltersGroup
