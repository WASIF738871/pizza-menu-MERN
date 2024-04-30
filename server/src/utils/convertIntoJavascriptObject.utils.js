const convertIntoJavascriptObject = (mongoQueryObj) => {
  return JSON.parse(JSON.stringify(mongoQueryObj));
};

export default convertIntoJavascriptObject;
