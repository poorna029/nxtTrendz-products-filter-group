import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

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

const statesList = {
  initial: 'Initital',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
  noProducts: 'noproducts',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    rating: '',
    category: '',
    title: '',
    activeStatus: statesList.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  noProducts = () => (
    <div className="no-products">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products.Try other filters</p>
    </div>
  )

  getProducts = async () => {
    this.setState({
      activeStatus: statesList.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, rating, title, category} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${title}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
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
      if (updatedData.length > 0) {
        this.setState({
          productsList: updatedData,
          activeStatus: statesList.success,
        })
      } else {
        this.setState({
          productsList: updatedData,
          activeStatus: statesList.noProducts,
        })
      }
    } else {
      this.setState({
        activeStatus: statesList.fail,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble processing your request.Please Try Again</p>
    </div>
  )

  renderViews = () => {
    const {activeStatus} = this.state

    switch (activeStatus) {
      case statesList.initial:
        return this.renderProductsList()

      case statesList.loading:
        return this.renderLoader()
      case statesList.success:
        return this.renderProductsList()
      case statesList.fail:
        return this.renderFailure()
      case statesList.noProducts:
        return this.noProducts()
      default:
        return null
    }
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
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

  ratingFn = e => {
    this.setState({rating: e}, this.getProducts)
  }

  inputEleFn = d => {
    this.setState({title: d}, this.getProducts)
  }

  categoryFn = f => {
    this.setState({category: f}, this.getProducts)
  }

  resetFn = () => {
    this.setState(
      {
        productsList: [],
        activeOptionId: sortbyOptions[0].optionId,
        rating: '',
        category: '',
        title: '',
      },
      this.getProducts,
    )
  }
  // TODO: Add failure view

  render() {
    const {rating, category} = this.state
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          inputEleFn={this.inputEleFn}
          ratingFn={this.ratingFn}
          categoryFn={this.categoryFn}
          resetFn={this.resetFn}
          activeCategoryId={category}
          activeRatingId={rating}
        />

        {this.renderViews()}
      </div>
    )
  }
}

export default AllProductsSection
