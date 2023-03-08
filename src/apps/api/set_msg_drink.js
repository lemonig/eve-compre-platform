
  import { _post, _download } from "@App/server/http";
  const basePath='undefined'
  // 饮用水源删除 
  export function delete(data) {  
    return _post({    
      url:`/api/info/drinkWaterSource/delete`,    
      data  
    })
  }
  // 饮用水源查询 
  export function list(data) {  
    return _post({    
      url:`/api/info/drinkWaterSource/list`,    
      data  
    })
  }
  // 饮用水源更新 
  export function update(data) {  
    return _post({    
      url:`/api/info/drinkWaterSource/update`,    
      data  
    })
  }
  // 饮用水源详情 
  export function get(data) {  
    return _post({    
      url:`/api/info/drinkWaterSource/get`,    
      data  
    })
  }
  // 饮用水源添加 
  export function add(data) {  
    return _post({    
      url:`/api/info/drinkWaterSource/add`,    
      data  
    })
  }