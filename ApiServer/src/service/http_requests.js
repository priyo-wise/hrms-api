class http_requests {
  constructor(httpRequest) {
    var url = require("url");

    this.httpRequest = httpRequest;

    var pathname = url.parse(this.httpRequest.url).pathname;

    this.resourcePath = pathname.split("/");
    this.resourceId = "";
    this.httpMethod = httpRequest.method;
    console.log("Path", this.resourcePath);

    if (this.resourcePath.length >= 3) {
      this.resourceId = this.resourcePath[2];
    }

    if (this.resourcePath.length >= 3) {
      this.resourceId = this.resourcePath[2];
    }
  }
}

module.exports = http_requests;
