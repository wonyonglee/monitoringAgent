const config = require('./../config/config')

//Error(시스템 이상상황)에 대한 처리
module.exports = new (function() {
	let that = this

	this.setSysErrorMessage = function(v) {
	  let error = false
	  let Alert = {}
	  let AlertMessage = []

	  if ( v.cpu > config.ALERT_WARNING.cpu ) {
	  	error = true
	  	AlertMessage.push('CPU 사용률 수치 오버 [ MAX '+ config.ALERT_WARNING.cpu +' / CUR '+ v.cpu +' ]')
	  }
	  if ( v.memory > config.ALERT_WARNING.memory ) {
	  	error = true
		AlertMessage.push('MEMORY 사용률 수치 오버 [ MAX '+ config.ALERT_WARNING.memory +' / CUR '+ v.memory +' ]')
	  }
	  if ( v.harddisk.length > 0 ) {
	  	for( var k in v.harddisk ) {
	  	  if ( v.harddisk[k].use > config.ALERT_WARNING.harddisk ) {
	  	  	error = true
			AlertMessage.push('하드디스크('+ v.harddisk[k].fs +') 사용률 수치 오버 [ MAX '+ config.ALERT_WARNING.harddisk +' / CUR '+ v.harddisk[k].use +' ]')
	  	  }
	  	}
	  }

	  Alert = { error: error, type: 'system', content: AlertMessage.join(',') }
	  return Alert
	}

	this.setSvcErrorMessage = function(v) {
	  let error = false
	  let Alert = {}
	  let AlertMessage = []
	  let contents = ''

	  if ( v.services.length > 0 ) {
	  	for( var k in v.services ) {
	  	  if ( !v.services[k].running ) {
	  	  	error = true
	  	  	AlertMessage.push(v.services[k].name)
	  	  }
	  	}

	  	if ( AlertMessage.length > 0 ) contents = '서비스 [ '+ AlertMessage.join(',') +' ] 가동 중단상태'
	  }

	  Alert = { error: error, type: 'service', content: contents }
	  return Alert	  
	}

	this.setSysError = function(v) {
	  return that.setSysErrorMessage(JSON.parse(v))
	}

	this.setSvcError = function(v) {
	  return that.setSvcErrorMessage(JSON.parse(v))
	}

	this.setEtcError = function() {

	}

	return this
})();

