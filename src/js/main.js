const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');
const Token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3RlLXRlc3RlIiwiaWF0IjoxMjM0NTY3ODkwfQ.dBYlRKiv21GIyyirzutnctnBj0iv4j_-rK7mfWz4Jc8"

//Configuração Global Axios
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';
axios.defaults.headers.common['Authorization'] = Token
axios.defaults.headers.post['Content-Type'] = 'application/json';

//Nova Instancia Do Axios
const newAxios = axios.create({
    baseURL :'http://api.example.com'
})
newAxios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';
newAxios.defaults.headers.common['Authorization'] = Token
newAxios.defaults.headers.post['Content-Type'] = 'application/json';

//Exemplo
// const newget = () => {
//     const config = {
//         params: {
//             _limit: 5
//         }
//     }
//     newAxios.get('users/', config)
//         .then((r) => {
//             renderOutput(r)
//         })
// }

// Adiciona um interceptador na requisição
axios.interceptors.request.use(function (config) {
    // Faz alguma coisa antes da requisição ser enviada
   // config.headers.Authorization ='Bearer' + Token
    console.log(config.headers);
    return config;
}, function (error) {
    // Faz alguma coisa com o erro da requisição
    return Promise.reject(error);
});


// Adiciona um interceptador na resposta
axios.interceptors.response.use(function (response) {
    // Qualquer código de status que dentro do limite de 2xx faz com que está função seja acionada
    // Faz alguma coisa com os dados de resposta
    console.log('success: ' + response);
    return response;
}, function (error) {
    // Qualquer código de status que não esteja no limite do código 2xx faz com que está função seja acionada
    // Faz alguma coisa com o erro da resposta
    console.log('error: ' + error.message)
    return Promise.reject(error);
});

const get = () => {
    const config = {
        params: {
            _limit: 5
        }
    }
    axios.get('users/', config)
    .then((r) => {
        renderOutput(r)
    })
}

const post = () => {
    const data = {
        title: 'foo',
        body:'bar',
        userId:1
    }
    axios.post('todos/', data)
    .then((r) => {
        renderOutput(r)
    })
}

const put = () => {
    const data = {
        id: 2,
        title: 'foo',
        body: 'bar',
        userId: 1
    }
    axios.put(`todos/${data.id}`, data)
        .then((r) => {
            renderOutput(r)
        })
}

function patch() {
    const data = {
        id: 2,
        title: 'Axios',
    }
    axios.put(`todos/${data.id}`, data)
        .then((r) => {
            renderOutput(r)
        })
}

const del = () => {
    const data = {
        id: 2,
    }
    axios.delete(`todos/${data.id}`)
        .then((r) => {
            renderOutput(r)
        })
}

const multiple = () => {
    const config = {
        params: {
            _limit: 5
        }
    }
    Promise.all([
        axios.get("todos/",config),
        axios.get("users/",config),
        axios.get("posts/",config)
    ]).then((r) => {
        console.table(r[0].data);
        console.table(r[1].data);
        console.table(r[2].data);
    })
}

const transform = () => {
    const config = {
        params: {
            _limit: 10
        },
        transformResponse: [function (data) {
            const payload = JSON.parse(data).map( o => {
                return{
                    id: o.id,
                    name: o.name.toUpperCase(),
                    email : o.email.toUpperCase(),
                    address : o.address.street + ", " +o.address.suite,
                    city: o.address.city.toUpperCase(),
                    zipcode: o.address.zipcode,
                }
            })
            return payload;
        }],
    }
    axios.get('users/', config)
        .then((r) => {
            renderOutput(r)
        })
}

const errorHandling = () => {
    axios.get('usersz/',)
        .then((r) => {
            renderOutput(r)
        })
        .catch((e) => {
           renderOutput(e.response)
        });
}

const cancel = () => {
    const controller = new AbortController();

    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    }
    axios.get('users/', config)
        .then((r) => {
            renderOutput(r)
        })
        .catch((e) => {
            window.alert("Request "+e.message);
        })

    controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
    window.location.reload(true);
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
