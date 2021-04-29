class QueryHandling {
	// query for mongoose and queryString for express
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		// BUILD THE QUERY
		// 1A)Filtering
		const queryObj = { ...this.queryString };
		// excluding fields sorted
		// exclude in query string as these filters are not to be found from database since they were not specified in Model Schema
		// this doesnt need to be in the queryObj when finding documents
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(el => delete queryObj[el]);

		// 1B) Advanced Filtering
		// Converting queries to a suitable filter
		let queryStr = JSON.stringify(queryObj); // convert object to a string
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //ex. {{URL}}/api/v1/tours?duration[gte]=10

		// This replaces the formating in the queryString to include $

		// { difficulty: 'easy', duration: { $gte: 5 } }
		// { difficulty: 'easy', duration: { gte: '5' } }
		// gte,gt,lte,lt
		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		// Multiple sort queries causes error as they result as a string = added hpp for parameter pollution
		if (this.queryString.sort) {
			// this.queryString.sort = ?sort= price,ratingsAverage....etc
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
			// sort('price ratingsAverage')
		} else {
			this.query = this.query.sort('-date');
		}

		return this;
	}

	limitFields() {
		// 3) Fields (fields=etc,etc)
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	paginate() {
		// 4) Pagination (page and limit)
		const page = parseInt(this.queryString.page) || 1;
		const limit = parseInt(this.queryString.limit) || 100;
		const skip = (page - 1) * limit;
		// page=2&limit=10 , 1-10 : page 1, 11-20: page 2
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = QueryHandling;
