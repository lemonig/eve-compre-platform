import axios from "axios";
import { message } from "antd";
import { PUSH_LOADING, SHIFT_LOADING } from "@Store/features/loadSlice";
import { store } from "../../store";

const instance = axios.create({
  // headers: {
  //   'Content-Type': "application/json; charset=utf-8",
  //   "X-Requested-With": "XMLHttpRequest",
  // },
})


instance.defaults.timeout = 30000;
instance.interceptors.request.use(
  (config) => {
    store.dispatch(PUSH_LOADING());
    if (localStorage.getItem("token") || !!localStorage.getItem("token")) {
      config.headers["token"] = localStorage.getItem("token");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) => {
    store.dispatch(SHIFT_LOADING());
    if (response.data && response.status === 200) {
      // 处理blob 格式数据
      if (Object.prototype.toString.call(response.data) === "[object Blob]") {
        if (response.data.type === 'application/octet-stream') {
        }
        //blbo格式数据处理错误处理
        else if (response.data.type === 'application/json') {
          console.error('Excel 导出错误');
          response.data.text().then(text => {
            let jsonText = JSON.parse(text)
            message.error(jsonText.message);
          })
          return Promise.reject(response);
        }
      }

      else if (response.data.code === 401) {
        // window.location.href = window.location.origin + "/loading";
      } else if (response.data.code === 403) {
      } else if (!response.data.success) {
        message.error(response.data.message);
      } else {
      }
      return Promise.resolve(response);
    } else {
      message.error(response.data.message);
      return Promise.reject(response);
    }
  },

  (error) => {
    SHIFT_LOADING();
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          message.error("401");
          localStorage.removeItem("token");
          window.location.href = window.location.origin + "/login";
          // window.location.href = window.location.origin + "/loading";
          break;
        case 403:
          message.error("403");
          window.location.href = window.location.origin + "/403";

          setTimeout(() => { }, 1000);
          break;
        case 404:
          message.error("404");
          break;
        case 504:
          message.error("504");
          break;
        // 其他错误，直接抛出错误提示
        default:
          message.error(error.response.statusText);
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * get
 * @param url
 * @param params
 * @returns {Promise<unknown>}
 * @private
 */
export const _get = ({ url, params }) => {
  return new Promise((rlv, rej) => {
    instance
      .get(url, {
        params: params,
      })
      .then((res) => {
        rlv(res);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

/**
 * post
 * @param url
 * @param data
 * @returns {Promise<unknown>}
 * @private
 */
export const _post = ({ url, data, headers = {
  'Content-Type': "application/json; charset=utf-8",
  "X-Requested-With": "XMLHttpRequest",
} }) => {
  return new Promise((rlv, rej) => {
    instance
      .post(url, data, { headers })
      .then((res) => {
        rlv(res.data);
      })
      .catch((err) => {
        rej(err.data);
      });
  });
};

export const _download = ({ url, data, title }) => {
  let nowDate = new Date();
  let day = nowDate.getDate();
  let month = nowDate.getMonth() + 1;
  let year = nowDate.getFullYear();
  return new Promise((rlv, rej) => {
    instance({
      method: "post",
      url: url,
      data: data,
      responseType: "blob",
    }).then((res) => {
      let result = res.data;
      var blob = new Blob([result], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var objectUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display:none");
      a.setAttribute("href", objectUrl);
      a.setAttribute("download", `${title}-${year}-${month}-${day}.xls`);
      a.click();
      URL.revokeObjectURL(objectUrl);
      rlv();
    }).catch(error => {
      rej(error)
    })
  });
};
export const _downloadPdf = ({ url, data, title }) => {
  let nowDate = new Date();
  let day = nowDate.getDate();
  let month = nowDate.getMonth() + 1;
  let year = nowDate.getFullYear();
  return instance({
    method: "post",
    url: url,
    data: data,
    responseType: "blob",
  }).then((res) => {
    let result = res.data;
    var blob = new Blob([result], {
      type: "application/pdf",
    });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    a.setAttribute("href", objectUrl);
    a.setAttribute("download", `${title}-${year}-${month}-${day}.pdf`);
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
};
