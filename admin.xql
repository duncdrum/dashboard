xquery version "3.1";

declare namespace output = "http://www.w3.org/2010/xslt-xquery-serialization";
declare option output:method "html5";
declare option output:media-type "text/html";

let $route := request:get-parameter("route","#/launcher")

return
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"/>
    <title>eXist-db Admin Dashboard</title>
    <link rel="stylesheet" href="resources/styles.css"/>
    <link rel="stylesheet" href="/node_modules/@shoelace-style/shoelace/dist/themes/light.css"/>
    <script type="module" src="existdb-dashboard.js"></script>
    <script type="module" src="bower_components/existdb-launcher/existdb-launcher.js"></script>
    <script type="module" src="bower_components/existdb-packagemanager/existdb-packagemanager.js"></script>
    <script type="module" src="bower_components/existdb-usermanager/existdb-usermanager.js"></script>
    <script type="module" src="bower_components/existdb-backup/existdb-backup.js"></script>
</head>
<body>
    <existdb-dashboard path="{$route}"></existdb-dashboard>
</body>
</html>
