Grails Reporting JS
===================

Usage:

```jsp
<script type="text/javascript">
	var config = {
		contextPath: '${request.contextPath}'
	}
</script>
<!-- angular, jquery, jquery-ui here -->
<r:require module="reporting-js"/>

<g:reportJs modelName="BookSale" />
```

Full code
```jsp
<!DOCTYPE html>
<html>
  <head>
		<meta name="layout" content="moon">
		<g:set var="entityName" value="${message(code: 'sale.label', default: 'Sale')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
		<script type="text/javascript">
			var config = {
				contextPath: '${request.contextPath}'
			}
		</script>

		<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"/>
		<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
		<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
		<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular.min.js"></script>
		<r:require module="reporting-js"/>
	</head>
	<body>
		<a href="${createLink(uri: '/')}">Home</a>
		<g:reportJs modelName="BookSale" />
	</body>
</html>


```

## 4 Developers

Grails 2.1.3 (try with <a href="http://gvmtool.net/">gvm</a>)

Open your favourite bash terminal and enter the following:
```sh
curl -s get.gvmtool.net | bash
gvm use grails 2.1.3
```

get the source

```sh
git clone git@github.com:fabiooshiro/grails-reporting-js.git
cd grails-reporting-js
grails run-app
```
open <a href="http://localhost:8080/grails-reporting-js/reportingJs">http://localhost:8080/grails-reporting-js/reportingJs</a>

### Core Files

- web-app/js/reporting.js (table and criteria)
- web-app/js/reporting-angular.js (user interface: angular controller)
- grails-app/views/reportingJs/_fullReport.gsp (user interface: angular template)
