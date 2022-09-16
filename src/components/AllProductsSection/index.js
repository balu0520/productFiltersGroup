import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Filters from '../Filters'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeRatingId: '',
    activeCategoryId: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  onClickClr = () => {
    this.setState(
      {
        productsList: [],
        searchInput: '',
        activeRatingId: '',
        activeCategoryId: '',
        activeOptionId: sortbyOptions[0].optionId,
        apiStatus: apiStatusConstants.initial,
      },
      this.getProducts,
    )
  }

  onClickRat = Rid => {
    this.setState({activeRatingId: Rid}, this.getProducts)
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchInput,
      activeCategoryId,
      activeRatingId,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${activeCategoryId}&rating=${activeRatingId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    console.log(apiUrl)
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      if (fetchedData.products.length === 0) {
        this.setState({
          productsList: [],
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      }
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoProductsView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="failure-icon"
      />
      <h1 className="failure-view-heading">No Products Found</h1>
      <p className="failure-view-para">
        We could not found any products. Try other filters.
      </p>
    </div>
  )

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onClickSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchStart = event => {
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  onClickCat = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  renderFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
      alt="products failure"
    />
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, searchInput} = this.state
    const isFailure = productsList.length === 0

    if (isFailure) {
      return this.renderNoProductsView()
    }

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          searchInput={searchInput}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
          clickSearch={this.clickSearch}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {searchInput, activeCategoryId, activeRatingId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <div className="filter-section">
          <input
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={this.onClickSearch}
            className="input-bar"
            onKeyDown={this.onClickSearchStart}
          />
          <h1 className="heading">Category</h1>
          <ul className="category-list-container">
            {categoryOptions.map(eachCategory => (
              <FiltersGroup
                key={eachCategory.id}
                activeCategoryId={activeCategoryId}
                onClickCat={this.onClickCat}
                categoryDetails={eachCategory}
              />
            ))}
          </ul>
          <h1 className="heading">Rating</h1>
          <ul className="rating-list-container">
            {ratingsList.map(eachRating => (
              <Filters
                key={eachRating.id}
                activeRatingId={activeRatingId}
                onClickRat={this.onClickRat}
                ratingDetails={eachRating}
              />
            ))}
          </ul>
          <button
            className="active-btn"
            onClick={this.onClickClr}
            type="button"
          >
            Clear filters
          </button>
        </div>
        {this.renderViews()}
      </div>
    )
  }
}

export default AllProductsSection
