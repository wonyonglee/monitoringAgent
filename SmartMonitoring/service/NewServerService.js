import si from 'systeminformation'

//Server 관련 정보 추출
class ServerService {
  constructor(FS_CHECK_LIST) {
  	this._fileList = FS_CHECK_LIST
  }

  async getSysInfo() {
	let initCpuInfo = this.getCpuInfo()
    let initMemoryInfo = this.getMemoryInfo()
    let initFileInfo = this.getFileInfo()

    return await Promise.all([initCpuInfo, initMemoryInfo, initFileInfo])
  }

  async getCpuInfo() {
    let currentCpu = 0

    try {
	  const data = await si.currentLoad();
	  currentCpu = Math.round(data.currentload)
	} catch (e) {
	  console.log(e)
    }

    return currentCpu
  }

  async getMemoryInfo() {
	let currentMemory = 0

	try {
	  const data = await si.mem();
	  currentMemory = Math.round(( data.used / data.total ) * 100)
	} catch (e) {
	  console.log(e)
	}

	return currentMemory
  }

  async getFileInfo() {
    let currentFileList = []

	try {
	  const data = await si.fsSize()
	  for( var k in data ) {
        for( var dk in this._fileList ) {
	      if ( this._fileList[dk] == data[k].fs ) {
	        currentFileList.push({ fs: data[k].fs, use: Math.round(data[k].use) })
	        break
	      }
	    }      
	  }
	} catch(e) {
	  console.log(e)
	}		

	return currentFileList
  }
}

export default ServerService