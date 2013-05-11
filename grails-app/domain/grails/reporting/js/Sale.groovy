package grails.reporting.js

class Sale{

	static belongsTo = [music: Music]

	BigDecimal price

	Long quantity

	Integer week
	Integer month
	Integer quarter
	Integer year

	Date date

	BigDecimal getAmount(){
		quantity * price
	}

	void setAmount(BigDecimal v){

	}

	static constraints = {
		year nullable: true
		month nullable: true
		week nullable: true
	}

	static mapping = {
		date column: 'SETTLEMENT_DATE'
		week formula: 'WEEK(SETTLEMENT_DATE)'
		month formula: 'MONTH(SETTLEMENT_DATE)'
		year formula: 'YEAR(SETTLEMENT_DATE)'
		quarter formula: 'QUARTER(SETTLEMENT_DATE)'
	}
}