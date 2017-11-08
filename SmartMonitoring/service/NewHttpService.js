import log4js from 'log4js'
import request from 'request'

const logger = log4js.getLogger()

class HttpService {
  constructor(LOG_LEVEL) {
  	this._level = LOG_LEVEL
  	logger.level = this._level
  }

  sendRequest(url, path, method, headers, data, callback) {
  	request.post({
	  url: url + path,
	  headers: headers,
	  body: data  		
  	}, function(e, r, body){
	  if ( e != null ) {
	    logger.error(e)
	  } else {
	  	logger.debug('requestBody: '+ data)
	    logger.debug('statusCode: '+ r.statusCode)
	    logger.debug('responseBody: '+ body)

	    callback(r.statusCode)	    
	  }
	})
  }
}

export default HttpService