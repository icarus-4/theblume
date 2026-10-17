// CloudFront Function `theblume-index-rewrite` (viewer request, cloudfront-js-2.0)
// attached to the site's distribution. Kept here for reference; update it in
// AWS with `aws cloudfront update-function` + `publish-function`.
//
// 1. www.theblume.in (the old domain) → 301 to the same path on www.theivies.in
// 2. /path/ → /path/index.html (S3 has no directory indexes)
// 3. /path  → 301 /path/ so every page has one canonical URL
function handler(event) {
  var req = event.request;
  var uri = req.uri;
  var host = req.headers.host ? req.headers.host.value : '';

  if (host === 'www.theblume.in') {
    var qs = Object.keys(req.querystring)
      .map(function (k) {
        var v = req.querystring[k].value;
        return v ? k + '=' + v : k;
      })
      .join('&');
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://www.theivies.in' + uri + (qs ? '?' + qs : '') } },
    };
  }

  if (uri.endsWith('/')) {
    req.uri = uri + 'index.html';
  } else if (uri.indexOf('.') === -1) {
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: uri + '/' } } };
  }
  return req;
}
