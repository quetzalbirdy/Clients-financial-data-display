import React, { useState, useEffect } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import BotonFiltrar from '../componentes-general/boton-filtrar';
import {serviciosFacturas} from '../../api/servicios'
import {CargandoCircular} from '../componentes-general/cargador-circular'
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import FiltroInput from '../componentes-general/filtroInput';

export default function Pagos() {
  const [filas, setFilas] = useState('');  
  const [dataResponse, setDataResponse] = useState('');
  const [filtroResponse, setFiltroResponse] = useState('');
  const [dataDetalle, setDataDetalle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [filtroActive, setFiltroActive] = useState(false);
  const [indexFilaVer, setIndexFilaVer] = useState('');

  useEffect(() => {
    obtenerPagosList() 
  }, []);

  var servicios = new serviciosFacturas();  
  const obtenerPagosList =  async () => {    
    await servicios.getPagosListByProveedor().then((res) => {    
      console.log(res)  
      const resOrdenado = res.sort((a, b) => b.fecha-a.fecha)
      setDataResponse(resOrdenado)
      var filasLocal = [];      
      for (var i = 0; i < resOrdenado.length; i++) {
        var pago = resOrdenado[i]
        var fila = [pago.fechaAsString, pago.medioPago, pago.montoAsString, pago.documentosAsociados.length === 2 ? `${pago.documentosAsociados[0]}, ${pago.documentosAsociados[1]}` : pago.documentosAsociados.length === 3 ? `${pago.documentosAsociados[0]}, ${pago.documentosAsociados[1]}, ${pago.documentosAsociados[2]}` : pago.documentosAsociados.length > 3 ? `${pago.documentosAsociados[0]}, ${pago.documentosAsociados[1]}, ${pago.documentosAsociados[2]}, ...` : pago.documentosAsociados]
        filasLocal.push(fila)        
      }      
      setFilas(filasLocal)            
    });
  }     

  const filtrarData = (dataFiltrada) => { 
    var filasLocal = [];       
    const resOrdenado = dataFiltrada.sort((a, b) => b.fechaEmision-a.fechaEmision)
    console.log(resOrdenado)
    setFiltroResponse(resOrdenado)
    for (var i = 0; i < dataFiltrada.length; i++) {
      var pago = dataFiltrada[i]
      var fila = [pago.fechaAsString, pago.medioPago, pago.montoAsString, pago.documentosAsociados.length === 2 ? `${pago.documentosAsociados[0]}, ${pago.documentosAsociados[1]}` : pago.documentosAsociados.length === 3 ? `${pago.documentosAsociados[0]}, ${pago.documentosAsociados[1]}, ${pago.documentosAsociados[2]}` : pago.documentosAsociados.length > 3 ? `${pago.documentosAsociados[0]}, ${pago.documentosAsociados[1]}, ${pago.documentosAsociados[2]}, ...` : pago.documentosAsociados]
      filasLocal.push(fila)        
    }      
    setFilas(filasLocal)    
  }

  const abrirModal = (indexFila, indexBoton) => {
    setIndexFilaVer(indexFila)
    setDataDetalle(filtroResponse ? filtroResponse[indexFila] : dataResponse[indexFila])    
    setModalOpen(true);         
  };

  const cerrarModal = () => {
    setDataDetalle('')    
    setModalOpen(false);    
  };
 
  const titulos = ['Fecha', 'Medio de pago','Monto', 'Docs. asociados', ''];
  const verDetalleFuncion = function(index) {
    abrirModal(index)
  }

  const toggleFiltro = () => {
    setFiltroActive(!filtroActive)
  }

  return(
    <div className="fondo-app compra pagos con-bottom-bar flex flex-column">
      <AppBar />        
      <div className={`contenido-ventana${filtroActive ? ' filtro-active' : ''}`}>
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Pagos recibidos</h2>
          {filas !== '' && <div className="titulo-tabla__botones flex flex-row">
            {/* <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faSortAmountUp} style={{fontSize: '18px'}} />
              <p>Ordenar</p>
            </Button>  */}
            <BotonFiltrar funcion={toggleFiltro} />  
            <FiltroInput data={dataResponse} funcion={filtrarData} />                       
          </div>}
        </div>            
        {filas !== '' ? <TablaBasica paginacion={true} titulos={titulos} dataTabla={filas} verDetalle={true} verDetalleFunction={verDetalleFuncion} /> : <CargandoCircular />}        
        {(dataDetalle !== '') && (indexFilaVer !== '') && <Modal
          open={modalOpen}
          onClose={() => cerrarModal(0)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ModalDetallePagos detallePago={filtroResponse ? filtroResponse[indexFilaVer] : dataResponse[indexFilaVer]} cerrarModal={() => cerrarModal()} />
        </Modal>}
      </div>
      <BottomBar />
    </div>        
  )
}

function ModalDetallePagos({detallePago, cerrarModal}) {    
  const [filasTabla, setFilasTabla] = useState('');
  const [filasPagoDetalle, setFilasPagoDetalle] = useState('');

  useEffect(() => {
    /* agregarFilasTabla() */
    obtenerPagoDetalle()
  }, [])

  var servicios = new serviciosFacturas();  
  const obtenerPagoDetalle =  async () => {           
    await servicios.getPago(detallePago.numero, detallePago.year, detallePago.sociedad).then((res) => {   
      console.log(res)              
      let detallePagoLocal = res 
      let filasDetalle = [
        [[detallePagoLocal.numero, 'Pago'], [detallePagoLocal.fechaAsString, 'Fecha'], [detallePagoLocal.montoAsString, 'Monto'],],
        [[detallePagoLocal.medioPago, 'Medio de pago']]
      ] 
      let documentosAsociados = res.documentos
      var filasLocal = [];      
      for (var i = 0; i < documentosAsociados.length; i++) {
        let documentoAsociado = documentosAsociados[i]
        let fila = [documentoAsociado.numero, documentoAsociado.fechaEmisionAsString, documentoAsociado.tipoDocumento, documentoAsociado.montoAsString]
        filasLocal.push(fila)        
      }      
      setFilasTabla(filasLocal)
      setFilasPagoDetalle(filasDetalle)
    });
  } 

  /* const agregarFilasTabla = () => {
    let filasLocal = []
    for (var i = 0; detallePago.documentosAsociados.length > i; i++) {
      filasLocal.push(
        [detallePago.documentosAsociados[i]]
      )
    }
    setFilasTabla(filasLocal)
  } */

  const filas = [
    [[detallePago.numero, 'Pago'], [detallePago.fechaAsString, 'Fecha'], [detallePago.montoAsString, 'Monto'],],
    [[detallePago.medioPago, 'Medio de pago']]
  ]   
  const titulosTabla = ['N', 'Fecha', 'Tipo', 'Monto']

  return(
    <div className="modal-basico modal-detalle-ordenes-compra flex flex-column">
      <Button className="modal-basico__cerrar" onClick={() => cerrarModal()}>
        <CloseIcon />
      </Button>
      <div className="modal__contenido">        
        {filasPagoDetalle && <TablaBasica dataTabla={filasPagoDetalle} /> }   
        <p>Documentos asociados</p>
        {filasTabla !== '' ? <TablaBasica titulos={titulosTabla} dataTabla={filasTabla} /> : <CargandoCircular />}    
      </div>      
    </div>       
  )
}