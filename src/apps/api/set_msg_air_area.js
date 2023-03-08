
  import { _post, _download } from "@App/server/http";
  const basePath='undefined'
  // 环境空气功能区删除 
  export function delete(data) {  
    return _post({    
      url:`/api/info/airZone/delete`,    
      data  
    })
  }
  // 环境空气功能区详情 
  export function get(data) {  
    return _post({    
      url:`/api/info/airZone/get`,    
      data  
    })
  }
  // 环境空气功能区更新 
  export function update(data) {  
    return _post({    
      url:`/api/info/airZone/update`,    
      data  
    })
  }
  // 环境功能区添加 
  export function add(data) {  
    return _post({    
      url:`/api/info/airZone/add`,    
      data  
    })
  }
  // 环境空气功能区查询 
  export function list(data) {  
    return _post({    
      url:`/api/info/airZone/list`,    
      data  
    })
  }