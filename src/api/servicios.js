import axios from 'axios';
import http from 'http';
import context from '../features/constants/Context';

var config = {
  baseURL: context.invokeURL,
  httpAgent: new http.Agent({ keepAlive: true }),
  headers: {
    'content-type': 'application/json;charset=utf-8'
  },
  method: 'get',
  timeout: 900000
};

var configLiferay = {
  baseURL: 'http://proveedores.local.cl/api/jsonws',
  httpAgent: new http.Agent({ keepAlive: true }),
  headers:{
    'Content-Type': 'application/json'
  },
  method: 'get',
  timeout: 900000
};

const formatURL = (data) =>{
  return Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + '/' + encodeURIComponent(data[k])
  }).join('/');
}

const evaluarObra = (responseData) => { 
  let responseDataLocal = responseData;
  for (var i = 0; responseDataLocal.length > i; i++) {    
    let pepObraActual = responseDataLocal[i].pepObra;        
    responseDataLocal[i].pepObra = nombreObra(pepObraActual)                
  }   
  function nombreObra(pep) {
    for (var i = 0; context.obras.length > i; i++) {        
      if (context.obras[i].pep === pep.slice(0, 9)) {
        return context.obras[i].name
      } else if (i == (context.obras.length - 1)) {
        return pep.slice(0, 9)
      }
    }
  }  
  return responseDataLocal
}

const fechaActual = context.fechaHasta;
const fechaCorteDesde = context.fechaDesde;

export class General {
  getIndicadores = async () => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor
    }    
    configLocal.url = "/general/indicadores";
    configLocal.method = 'post';  
    configLocal.data = data    
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }
}

export class serviciosFacturas {    
  
  getObraPep = async () => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "groupId": "25754",
      "pep": "S-0357-01-04-05",      
    }    
    configLocal.baseURL = "http://conectadev.portal.vsoft.cl/api/jsonws/vs-bpm-screen-portlet.solicitud/get-obra-by-pep";
    configLocal.method = 'get';  
    configLocal.data = data       
    configLocal.headers = {
      'content-type': 'application/json;charset=utf-8',
      'Authorization': '#', 
    }
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;    
      console.log(respuesta)  
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }
         
  getFacturaList = async (estadoFactura) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor,
      "estado": estadoFactura,
      "fechaEmisionDesde": fechaCorteDesde,
      "fechaEmisionHasta": fechaActual,
      "isFactoring": context.flagFactoring

    }  
    configLocal.url = "/factura/list";
    configLocal.method = 'post';  
    configLocal.data = data       
    await axios(configLocal)
    .then((response) => {
      console.log(response.data)
      respuesta = evaluarObra(response.data.payload);                 
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getFacturaDetalle = async (numeroDoc) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroDoc": numeroDoc
    }   
    configLocal.url = "/factura/get";
    configLocal.method = 'post';  
    configLocal.data = data    
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getFacturaReference = async (numeroFactura) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor,
      "referencia": numeroFactura
     }
    configLocal.url = "/factura/getByReference";
    configLocal.method = 'post';  
    configLocal.data = data    
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }
  
  getBitacoraDetalle = async (numeroFactura) => {
    console.log(numeroFactura)
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroFactura": numeroFactura
    }   
    configLocal.url = "/factura/getBitacora";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getListByOC = async (numOC) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroOC": numOC
    }
    configLocal.url = "/factura/listByOC";
    configLocal.method = 'post';  
    configLocal.data = data        
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = evaluarObra(response.data.payload);
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getCuentaCorriente = async () => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor
    }
    configLocal.url = "/cuentaCorriente/get";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getCuentaCorrienteList = async (numero, mes) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numero": numero,
      "mes": mes
    }
    configLocal.url = "/cuentaCorriente/list";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getOrdenCompraList = async (estadoOC) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor,
      "estado": "09",
      "fechaDesde": fechaCorteDesde,
    }
    configLocal.url = "/ordenCompra/list";
    configLocal.method = 'post';      
    configLocal.data = data    
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = evaluarObra(response.data.payload);
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]    
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        respuesta = error.request  
        respuesta = error
        console.log(error);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
        respuesta = error.message        
      }
  
    });
    return respuesta
  }

  getOrdenCompraDetalle = async (numeroOC) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroOC": numeroOC
    }
    configLocal.url = "/ordenCompra/get";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = evaluarObra(response.data.payload);
      console.log("DetalleOc: ", respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getRecepcionesList = async (tipo, corteDias) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor,
      "tipo": tipo ? tipo : -1,
      "estado": -1,
      "fechaDesde": corteDias ? fechaActual - 5184000000 : fechaCorteDesde
    }
    configLocal.url = "/recepciones/list";
    configLocal.method = 'post';  
    configLocal.data = data    
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      console.log(response)
      respuesta = evaluarObra(response.data.payload);      
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getRecepcionesListByOC = async (numOC) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroOC": numOC
    }
    configLocal.url = "/recepciones/listByOC";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      console.log('listbyoc', response)      
      respuesta = evaluarObra(response.data.payload);
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getRecepciones = async () => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numero": 4676
    }
    configLocal.url = "/recepciones/get";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getRecepcionesDetail = async (numero, tipo) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numero": numero,
      "tipo": tipo
    }
    configLocal.url = "/recepciones/detail";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      /* console.log(respuesta) */
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getPagosListByOC = async (num) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroOC": num
    }
    configLocal.url = "/pagos/listByOC";
    configLocal.method = 'post';      
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)    
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getPagosListByFactura = async () => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numeroFactura": 3234
    }
    configLocal.url = "/pagos/listByFactura";
    configLocal.method = 'post';  
    configLocal.data = data    
    /* console.log(configLocal)  */
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getPagosListByProveedor = async () => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "codigoProveedor": context.codigoProveedor,
      "estado": -1,
      "fechaPagoDesde": fechaCorteDesde,
      "fechaPagoHasta": fechaActual
    }  
    configLocal.url = "/pagos/list";
    configLocal.method = 'post';  
    configLocal.data = data          
    await axios(configLocal)
    .then((response) => {
      respuesta = /* evaluarObra(response.data.payload) */response.data.payload;                 
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getPago = async (numeroDoc, ano, sociedad) => {
    let respuesta;    
    let configLocal = config;                     
    const data = {
      "numDoc": numeroDoc.toString(),
      "year": ano,
      "sociedad": sociedad
  }
    configLocal.url = "/pagos/get";
    configLocal.method = 'post';  
    configLocal.data = data     
    console.log(configLocal)      
    await axios(configLocal)
    .then((response) => {
      respuesta = /* evaluarObra(response.data.payload) */response.data.payload;                 
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)   
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }

  getCalcular = async () => {
    let respuesta;    
    let configLocal = configLiferay;                     
    const data = {
      "fecha-estimada-pago": "2021-03-25",
      "monto": "1"
    };
    configLocal.url = "/vs-ebco-proveedores-portlet.firmax/get-calcular/" + formatURL(data);
    let params = {};
    params.p_auth = context.p_auth;
    configLocal.params = params;

    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
        alert(configLocal.url + ': ' + error.response.data + ', ' + error.response.status)  
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        alert(configLocal.url + ': ' + error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        alert(configLocal.url + ': ' + error.message)
      }
  
    });
    return respuesta
  }
}