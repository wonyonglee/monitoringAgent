import log4js from 'log4js'
import HttpService from './NewHttpService'
import ErrorService from './NewErrorService'

const logger = log4js.getLogger()

class APIService {
  constructor(ALERT_WARNING, LOG_LEVEL, SERVER_IP, URL, SYSURI, SVCURI, ERRURI) {
    logger.level = LOG_LEVEL
    this.httpService = new HttpService(LOG_LEVEL)
    this.errorService = new ErrorService(ALERT_WARNING)

    this._ip = SERVER_IP
    this._url = URL
    this._sysuri = SYSURI
    this._svcuri = SVCURI
    this._erruri = ERRURI
    this._headers = {
      'Content-Type': 'application/json'
    }
  }

  // 서버정보저장
  setServerInfo (data) {
    // { server: '183.111.159.73', cpu: 16, memory: 14, harddisk:[ { fs: 'E:/', use: 46 } ] }
    var senddata = JSON.stringify({
      server: this._ip,
      cpu: data[0],
      memory: data[1],
      harddisk: data[2]
    })

    let errObj = this.errorService.setSysError(senddata)
    if ( errObj.error ) this.setErrorLog(errObj)

    this.httpService.sendRequest(this._url, this._sysuri, 'POST', this._headers, senddata, (res) => {
      logger.info("Insert Server Resource")
      console.log(res)
    })
  }

  // 프로세스정보 저장
  setProcessInfo(data) {
    var senddata = JSON.stringify({
      server: this._ip,
      services: data
    })

    let errObj = this.errorService.setSvcError(senddata)
    if ( errObj.error ) this.setErrorLog(errObj)

    this.httpService.sendRequest(this._url, this._svcuri, 'POST', this._headers, senddata, (res) => {
      logger.info("Insert Process Resource")
      console.log(res)
    })      
  }

  setErrorLog(data) {
    var senddata = JSON.stringify({
      server: this._ip,
      type: data.type,
      content: data.content
    })   

    this.httpService.sendRequest(this._url, this._erruri, 'POST', this._headers, senddata, (res) => {
      logger.info("Insert ErrorLog")
      console.log(res)
    })       
  }
}

export default APIService