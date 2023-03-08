
  import { _post, _download } from "@App/server/http";
  const basePath='undefined'
  // 环境敏感点详情 
  export function get(data) {  
    return _post({    
      url:`/api/info/sensitivePoint/get`,    
      data  
    })
  }
  // 环境敏感点更新 
  export function update(data) {  
    return _post({    
      url:`/api/info/sensitivePoint/update`,    
      data  
    })
  }
  // 环境敏感点查询 
  export function list(data) {  
    return _post({    
      url:`/api/info/sensitivePoint/list`,    
      data  
    })
  }
  // 环境敏感点删除 
  export function delete(data) {  
    return _post({    
      url:`/api/info/sensitivePoint/delete`,    
      data  
    })
  }
  // 环境敏感点添加 
  export function add(data) {  
    return _post({    
      url:`/api/info/sensitivePoint/add`,    
      data  
    })
  }