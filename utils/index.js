const baseUrl = "https://wedfield.s3.ap-south-1.amazonaws.com";
module.exports = {
  replaceS3BaseUrl: (url) => {
    if (typeof url === "string") {
      return url?.replaceAll(baseUrl, "");
    } else return url;
  },
};
