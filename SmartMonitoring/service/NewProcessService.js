import si from 'systeminformation'

//Process(Service) 관련 정보 추출
class ProcessService {
  constructor(SVC_CHECK_LIST) {
  	this._serviceList = SVC_CHECK_LIST
  }

  async getProcessInfo () {
	let processList = [];

	try {
	  const data = await si.services( this._serviceList.join(", ") );
	  processList = data;
	} catch (e) {
	  console.log(e)
	}

	return processList    	
  }
}

export default ProcessService