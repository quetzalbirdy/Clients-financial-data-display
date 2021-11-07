import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, 
  useHistory
} from "react-router-dom";
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import {serviciosFacturas} from '../../api/servicios'
import {CargandoCircular} from '../componentes-general/cargador-circular'
import BotonFiltrar from '../componentes-general/boton-filtrar';
import FiltroInput from '../componentes-general/filtroInput';

export default function OrdenesCompra() {
  const [numerosOC, setNumerosOC] = useState('')
  const [filas, setFilas] = useState('')  
  const [totalFacturado, setTotalFacturado] = useState('');
  const [responseOCList, setResponseOCList] = useState('');
  const [filtroResponse, setFiltroResponse] = useState('');
  const [filtroActive, setFiltroActive] = useState(false);
  const estadoOC = -1
  let history = useHistory();

  useEffect(() => {
    obtenerOC(estadoOC) 
  }, []);

  var servicios = new serviciosFacturas();  
  const obtenerOC =  async (estadoOC) => {    
    await servicios.getOrdenCompraList(estadoOC).then((res) => {
      /* if (res.length > 0 && res !== null) { */
        const resOrdenado = res.sort((a, b) => b.fechaEmision-a.fechaEmision)
        console.log(resOrdenado)
        setResponseOCList(resOrdenado)
        var filasLocal = [];
        var numerosOCLocal = [];
        var totalFacturadoLocal = 0;
        for (var i = 0; i < resOrdenado.length; i++) {
          var oc = resOrdenado[i]
          var fila = [[oc.numeroDoc.toString(), oc.fechaEmisionAsString], oc.numeroDoc.toString(), oc.fechaEmisionAsString, oc.totalAsString, oc.totalRecibidoAsString, oc.totalFacturadoAsString, oc.totalPagadoAsString, oc.pepObra, oc.tipo.toString(), generarEstado(oc.estado.toString()), oc.tipo, oc.contacto]
          if (oc.totalFacturado != '') {
            totalFacturadoLocal += parseInt(oc.totalFacturado)
          }          
          filasLocal.push(fila)
          numerosOCLocal.push(oc.numero)
        }            
        setFilas(filasLocal)      
        setNumerosOC(numerosOCLocal)
        setTotalFacturado(totalFacturadoLocal)
      /* } */ /* else {
        alert(res.toString())
      } */
    });
  } 

  const generarEstado = (estadoNumero) => {    
    switch (estadoNumero.toString()) {              
      case "01":
      case "02":
      case "03":
      case "04":            
        return "En aprobación"
      case "05": 
        return "Aprobada"
      case "06":
        return "Rechazada"
      case "07":
      case "08":
        return "En ejecución"    
      case "09":
        return "Cerrada"
    }
  }
  
  const titulos = [
    'N°OC/Fecha', 
    '#',
    'Fecha',
    'Monto total',
    'Monto neto recibido',
    'Monto total facturado',
    'Monto total pagado',
    'Obra', 
    'Tipo',  
    'Estado',   
    'Tipo',
    'Contacto',
    '',
  ];  
  const funcionVer = function(index) {
    history.push({
      pathname: "/orden-de-compra",
      state: {
        numeroOC: filas[index][1],        
        dataOC: filtroResponse ? filtroResponse[index] : responseOCList[index]
      }
    })
  };

  const filtrarData = (dataFiltrada) => {    
    var filasLocal = [];
    var numerosOCLocal = [];
    var totalFacturadoLocal = 0;
    const resOrdenado = dataFiltrada.sort((a, b) => b.fechaEmision-a.fechaEmision)
    console.log(resOrdenado)
    setFiltroResponse(resOrdenado)
    for (var i = 0; i < dataFiltrada.length; i++) {
      var oc = dataFiltrada[i]
      var fila = [[oc.numeroDoc.toString(), oc.fechaEmisionAsString], oc.numeroDoc.toString(), oc.fechaEmisionAsString, oc.totalAsString, oc.totalRecibidoAsString, oc.totalFacturadoAsString, oc.totalPagadoAsString, oc.pepObra, oc.tipo.toString(), generarEstado(oc.estado.toString()), oc.tipo, oc.contacto]
      if (oc.totalFacturado != '') {
        totalFacturadoLocal += parseInt(oc.totalFacturado)
      }      
      filasLocal.push(fila)
      numerosOCLocal.push(oc.numero)
    }  
    setFilas(filasLocal)      
    setNumerosOC(numerosOCLocal)
    setTotalFacturado(totalFacturadoLocal)    
  }

  const toggleFiltro = () => {
    setFiltroActive(!filtroActive)
  }

  return(
    <div className="fondo-app ordenes-compra compra con-bottom-bar flex flex-column">
      <AppBar />        
      <div className={`contenido-ventana${filtroActive ? ' filtro-active' : ''}`}>
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Ordenes de compra emitidas</h2>    
          {filas && <div className="titulo-tabla__botones flex flex-row">            
            <BotonFiltrar funcion={toggleFiltro} />         
            <FiltroInput data={responseOCList} funcion={filtrarData} />                                          
          </div>}          
        </div>          
        {totalFacturado !== '' && <ValorTotal texto={'Total facturado'} valorTotal={totalFacturado.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}/>}     
        {filas ? <TablaBasica paginacion={true} titulos={titulos} dataTabla={filas} verDetalle={true} verDetalleFunction={funcionVer} /> : <CargandoCircular />}    
      </div>
      <BottomBar />
    </div>        
  )
}