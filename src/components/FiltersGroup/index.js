import './index.css'

const FiltersGroup = props => {
  const {activeCategoryId, onClickCat, categoryDetails} = props
  const {categoryId, name} = categoryDetails
  const isActive = categoryId === activeCategoryId
  const clsName = isActive ? 'active' : 'inactive'

  const onClickCategory = () => {
    onClickCat(categoryId)
  }

  return (
    <li className="filters-group-container">
      <button className="btn" type="button" onClick={onClickCategory}>
        <p className={clsName}>{name}</p>
      </button>
    </li>
  )
}

export default FiltersGroup
