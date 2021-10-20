const filterAPI = async (queryObject, model) => {
  const defaultLimit = 50;
  const newQueryObject = { ...queryObject };
  [
    "sort",
    "page",
    "limit",
    "select",
    "minprice",
    "maxprice",
    "mingroupsize",
    "maxgroupsize",
    "mintourlength",
    "maxtourlength",
  ].forEach((item) => {
    delete newQueryObject[item];
  });
  let query;
  query = model.find(newQueryObject);
  if (queryObject.minprice) {
    const minPrice = queryObject.minprice * 1;
    query = query.find({ price: { $gt: minPrice } });
  }
  if (queryObject.maxprice) {
    const maxPrice = queryObject.maxprice * 1;
    query = query.find({ price: { $lt: maxPrice } });
  }
  if (queryObject.mingroupsize) {
    const minGroupSize = queryObject.minGroupSize * 1;
    query = query.find({ groupSize: { $gt: minGroupSize } });
  }

  if (queryObject.maxgroupsize) {
    const maxgroupsize = queryObject.maxgroupsize * 1;
    query = query.find({ groupSize: { $lt: maxgroupsize } });
  }

  if (queryObject.mintourlength) {
    const mintourlength = queryObject.mintourlength * 1;
    query = query.find({ tourLength: { $gt: mintourlength } });
  }

  if (queryObject.maxtourlength) {
    const maxtourlength = queryObject.maxtourlength * 1;
    query = query.find({ tourLength: { $lt: maxtourlength } });
  }
  if (queryObject.sort) {
    const sortData = queryObject.sort.split(",").join(" ");
    query = query.sort(sortData);
  }
  if (queryObject.select) {
    const selectData = queryObject.select.split(",").join(" ");
    query = query.select(selectData);
  }
  if (queryObject.page) {
    // const totalDoc = await query.model.countDocuments(query);
    const pageNumber = queryObject.page * 1;
    const limit = queryObject.limit ? queryObject.limit * 1 : defaultLimit;
    query = query.skip((pageNumber - 1) * limit);
  }
  if (queryObject.limit) {
    const limit = queryObject.limit * 1;
    query = query.limit(limit);
  } else {
    query = query.limit(defaultLimit);
  }
  const totalDoc = await query.model.countDocuments();
  return { toursQuery: query, totalDoc: totalDoc };
};

module.exports = filterAPI;
