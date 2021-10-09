class FilterQuery {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
    this.newFilteredObject = {};
  }

  filter() {
    this.newFilteredObject = { ...this.queryObject };
    ["page", "limit", "select"].forEach((key) => {
      delete this.newFilteredObject[key];
    });
    this.query = this.query.find(this.newFilteredObject);
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      let sortObject = {};
      this.queryObject.sort.split(",").forEach((item) => {
        if (item.toString().startsWith("-")) {
          sortObject[item.split("-")[1]] = -1;
        } else {
          sortObject[item] = 1;
        }
      });
      this.query = this.query.sort(sortObject);
    } else {
      this.query = this.query.sort("-_id");
    }
    return this;
  }

  select() {
    if (this.queryObject.select) {
      this.query = this.query.select(
        this.queryObject.select.split(",").join(" ")
      );
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}

module.exports = FilterQuery;
