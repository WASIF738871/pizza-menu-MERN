const docList = (schema) => {
  schema.statics.docList = async function (filter, options) {
    let { fields, limit, page, sortBy } = options;
    if (page) limit = limit || 10;
    const skip = ((page ? page : 1) - 1) * limit;
    sortBy = sortBy?.split(',').join(' ') || '-createdAt';
    fields = fields?.split(',').join(' ');
    // let docList = this.find(filter).select(fields).skip(skip).limit(limit).sort(sortBy).explain();
    let docList = this.find(filter).select(fields).skip(skip).limit(limit).sort(sortBy);

    // if (options.populate) {
    //   options.populate.split(',').forEach((populateOption) => {
    //     docsPromise = docsPromise.populate(
    //       populateOption
    //         .split('.')
    //         .reverse()
    //         .reduce((a, b) => ({ path: b, populate: a })),
    //     );
    //   });
    // }

    // docsPromise = docsPromise.exec();

    // return Promise.all([countPromise, docsPromise]).then((values) => {
    //   const [totalResults, results] = values;
    //   const totalPages = Math.ceil(totalResults / limit);
    //   const result = {
    //     results,
    //     page,
    //     limit,
    //     totalPages,
    //     totalResults,
    //   };
    //   return Promise.resolve(result);
    // });
    return docList;
  };
};

export default docList;
