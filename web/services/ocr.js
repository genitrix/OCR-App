import axios from "axios"



const sendFile = (file, progressSetter, model = 'easyocr') => {
    console.log(model);
    const data = new FormData();
    data.append('image', file);

    var config = {
        method: 'post',
        url: `/api/${model}`,
        onUploadProgress: progressEvent => {
            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
            progressSetter(complete)
            console.log(complete);
            if (complete === 100) {
                // OpenToggler(false)
            }
        },
        data: data,
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data
        })
        .catch(function (error) {
            console.log(error);
        });

}

const register = (username, password) => {
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);

    var config = {
        method: 'post',
        url: '/api/user/register',
        headers: {
            ...data.headers
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            console.log("register:" + JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

}

const login = (username, password) => {
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);

    var config = {
        method: 'post',
        url: '/api/user/login',
        headers: {
            ...data.headers
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            console.log("nin axios")
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

const logout = () => {


}


function convertBase64UrlToFile(urlData){  
    var mimeString = urlData.split(',')[0].split(':')[1].split(';')[0]; // mime类型
    var byteString = atob(urlData.split(',')[1]); //base64 解码
    var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
    var intArray = new Uint8Array(arrayBuffer); //创建视图
    for (var i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const bb = new Blob([intArray], {type: mimeString});
    return new File([bb],"image.png")
}

export default { sendFile, register, login ,convertBase64UrlToFile };
