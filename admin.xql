xquery version "3.1";

declare namespace output = "http://www.w3.org/2010/xslt-xquery-serialization";
declare option output:method "html5";
declare option output:media-type "text/html";

let $route := request:get-parameter("route","#/launcher")

return
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"/>
    <title>eXist-db Admin Dashboard</title>
    <link rel="stylesheet" href="resources/styles/webawesome.css"/>
    <link rel="stylesheet" href="resources/styles.css"/>
    <script type="importmap">
      {
        "imports": {
          "lit": "./resources/scripts/lit/index.js",
          "lit/": "./resources/scripts/lit/",
          "@awesome.me/webawesome/": "./resources/scripts/@awesome.me/webawesome/",
          "@existdb/repo-elements": "./resources/scripts/@existdb/repo-elements/dist/repo-elements.js"
        }
      }
    </script>
    <script type="module" src="resources/scripts/dist/load-admin.js"></script>
</head>
<body>
    <existdb-dashboard path="{$route}"></existdb-dashboard>
</body>
</html>
