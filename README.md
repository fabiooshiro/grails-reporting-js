grails-reporting-js
===================

Grails Reporting

```jsp
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


````

http://localhost:8080/grails-reporting-js/reportingJs

Live example: <a href="http://poetrystore.aws.af.cm/sale/report">http://poetrystore.aws.af.cm/sale/report</a>
