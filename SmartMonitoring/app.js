import schedule from 'node-schedule'

import Mongo from './config/mongo'
import ServerService from './service/NewServerService'
import ProcessService from './service/NewProcessService'
import APIService from './service/NewAPIService'

// 현재 올라갈 서버IP & Server 환경설정값 호출
const config = new Mongo('')

let procService = (type) => {
  config.getConfig((renewConfig) => {
    // EXEC_STATUS 여부가 TRUE일때 가동
    if ( renewConfig.EXEC_STATUS ) {
      let serverService = new ServerService(renewConfig.FS_CHECK_LIST)
  	  let processService = new ProcessService(renewConfig.SVC_CHECK_LIST)
  	  let apiService = new APIService(renewConfig.LOG_LEVEL, renewConfig.SERVER_IP, renewConfig.API_INFO.URL, renewConfig.API_URI.system, renewConfig.API_URI.service, renewConfig.API_URI.error)

  	  if ( type == 'server' ) {
		serverService.getSysInfo().then((v) => {
		  apiService.setServerInfo(v)
		})
  	  } else if ( type == 'service' ) {
		processService.getProcessInfo().then((v) => {
  	      apiService.setProcessInfo(v)
  	  	})
  	  }
    }
  })
}

// 최초 환경설정 로딩 후 가동
config.getConfig(function(configs) {
  schedule.scheduleJob(configs.SCHEDULER_TERM.system, () => {
  	procService('server')
  })

  schedule.scheduleJob(configs.SCHEDULER_TERM.service, () => {
  	procService('service')
  })
})