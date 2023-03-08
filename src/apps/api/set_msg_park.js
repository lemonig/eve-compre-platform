
  import { _post, _download } from "@App/server/http";
  const basePath='undefined'
  // 园区更新 
  export function update(data) {  
    return _post({    
      url:`/api/info/park/update`,    
      data  
    })
  }
  // 园区删除 
  export function delete(data) {  
    return _post({    
      url:`/api/info/park/delete`,    
      data  
    })
  }
  // 园区查询 
  export function list(data) {  
    return _post({    
      url:`/api/info/park/list`,    
      data  
    })
  }
  // 园区详情 
  export function get(data) {  
    return _post({    
      url:`/api/info/park/get`,    
      data  
    })
  }
  // 园区添加 
  export function add(data) {  
    return _post({    
      url:`/api/info/park/add`,    
      data  
    })
  }