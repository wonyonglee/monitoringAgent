//Error(시스템 이상상황)에 대한 처리
class ErrorService {
  constructor(ERR_MAX) {
  	this._errmax = ERR_MAX
  }  

  setSysErrorMessage(curobj) {
    let error = false
    let Alert = {}
    let AlertMessage = []

    if ( curobj.cpu > this._errmax.cpu ) {
  	  error = true
  	  AlertMessage.push('CPU 사용률 수치 오버 [ MAX '+ this._errmax.cpu +' / CUR '+ curobj.cpu +' ]')
    }
    if ( curobj.memory > this._errmax.memory ) {
  	  error = true
	  AlertMessage.push('MEMORY 사용률 수치 오버 [ MAX '+ this._errmax.memory +' / CUR '+ curobj.memory +' ]')
    }
    if ( curobj.harddisk.length > 0 ) {
  	  for( var k in curobj.harddisk ) {
  	    if ( curobj.harddisk[k].use > this._errmax.harddisk ) {
  	  	  error = true
		  AlertMessage.push('하드디스크('+ curobj.harddisk[k].fs +') 사용률 수치 오버 [ MAX '+ this._errmax.harddisk +' / CUR '+ curobj.harddisk[k].use +' ]')
  	    }
  	  }
    }

    Alert = { error: error, type: 'system', content: AlertMessage.join(',') }
    return Alert
  }

  setSvcErrorMessage(curobj) {
	let error = false
	let Alert = {}
	let AlertMessage = []
	let contents = ''

	if ( curobj.services.length > 0 ) {
	  for( var k in curobj.services ) {
	    if ( !curobj.services[k].running ) {
	  	  error = true
	  	  AlertMessage.push(curobj.services[k].name)
	  	}
	  }

	  if ( AlertMessage.length > 0 ) contents = '서비스 [ '+ AlertMessage.join(',') +' ] 가동 중단상태'
	}

	Alert = { error: error, type: 'service', content: contents }
	return Alert	  	
  }

  setSysError(curobj) {
  	return this.setSysErrorMessage(JSON.parse(curobj))
  }

  setSvcError(curobj) {
  	return this.setSvcErrorMessage(JSON.parse(curobj))
  }

  setEtcError(curobj) {

  }
}

export default ErrorService