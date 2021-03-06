import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import BookDisplay from './BookDisplay'
import * as BooksAPI from './BooksAPI'
import debounce from 'debounce'
import BookModal from './BookModal'
import LeftNav from './LeftNav.js'


class SearchBooks extends Component {
	constructor(props){
		super(props);
	    this.state = {
	    	query: [],
	      	select: '',
      		modalDisplay:'none'
	    }
	    this.queryChange.bind(this)
	    this.handleChange.bind(this)
	    this.updateBookSelect.bind(this)
	    this.closeBookModal.bind(this)
	}

	//Updates the current book selected for the modal
	updateBookSelect = (book) => {
		this.setState({
		  select: book,
		  modalDisplay:'block'
		})
	}

	//Closes the book modal
	closeBookModal = () => {
		this.setState({modalDisplay:'none'})
	}
	noSearchesFound = () => {
		alert('Please search something else');
	}

	//Implementing Query change functionality with Debounce to minimize the API calls
	queryChange = debounce((searchTerm) => {
	BooksAPI.search(searchTerm, 100).then((books) => {

	  //Checks to see if the callback is an array and if not, creates an empty one followed by an alert to have the user search again.
	  const searchedBooks = Array.isArray(books) ? books : [];
	  if(searchedBooks.length === 0){
	  	this.noSearchesFound()
	  	return false;
	  }
	  //Map out new search results based on the state of the
	  const newBook = searchedBooks.map((obj) => {
	    let currentBook = this.props.currentBooks.filter((currBook) => currBook.id === obj.id)
	    let updatedObj = obj;
	    if(currentBook.length > 0){
	      updatedObj.shelf = currentBook[0].shelf;
	    } else {
	      //Setting the Book to none if a selection hasn't been made yet
	      updatedObj.shelf = 'none';
	    }
	    return updatedObj
	  });
	  this.setState({query: newBook})
	})
	}, 500)

	//Passing updating book status to select children
	handleChange = (book,bookStatus) => {
		this.props.add(book,bookStatus)
	}

	render(){
		return (
	      <div className="search-books">
	        <LeftNav />
	        <div className="search-right">
		        <div className="search-books-bar">
		          <Link to="/" className="close-search">Close</Link>
		          <div className="search-books-input-wrapper">
		            <input type="text" placeholder="Search by title or author"
		              onChange={(e) => this.queryChange(e.target.value)}
		            />
		          </div>
		        </div>
		        <div className="search-books-results">
		          {this.state.query.length > 0 && (
		            <BookDisplay list={this.state.query} update={this.handleChange} modalUpdate={this.updateBookSelect} />
		          )}
		        </div>
	        	<BookModal bookClick={this.state.select} display={this.state.modalDisplay} closeModal={this.closeBookModal}/>
	        </div>
	      </div>
		)
	}
}

export default SearchBooks