import './index.css'

const Filters = props => {
  const {activeRatingId, onClickRat, ratingDetails} = props
  const {ratingId, imageUrl} = ratingDetails
  const isActive = activeRatingId === ratingId
  const clsname = isActive ? 'active' : 'inactive'

  const onClickRating = () => {
    onClickRat(ratingId)
  }

  return (
    <li className="rating-item">
      <button type="button" className="btn" onClick={onClickRating}>
        <img src={imageUrl} alt={`rating ${ratingId}`} className="icon" />
      </button>
      <p className={clsname}>&up</p>
    </li>
  )
}

export default Filters
