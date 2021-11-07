import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import { CargandoCircular, CargandoCircularModal } from '../componentes-general/cargador-circular';
import {serviciosFacturas} from '../../api/servicios'
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import BotonFiltrar from '../componentes-general/boton-filtrar';
import FiltroInput from '../componentes-general/filtroInput';

export default function Recepciones() {
  const [codigoProveedor, setCodigoProveedor] = useState(7653);  
  const [tipo, setTipo] = useState(-1);
  const [recepcionesFilas, setRecepcionesFilas] = useState();    
  const [modalPagosAbierto, setModalPagosAbierto] = useState(false);
  const [indiceFila, setIndiceFila] = useState('');
  const [recepcionesRes, setRecepcionesRes] = useState('');
  const [filtroResponse, setFiltroResponse] = useState('');
  const [filtroActive, setFiltroActive] = useState(false);
  var anchoPantalla = window.innerWidth;
  let history = useHistory();

  useEffect(() => {
    obtenerRecepciones() 
  }, []);

  const abrirModal = (index, indexFilaMenu) => {
    setIndiceFila(index)
    setModalPagosAbierto(true)
  }
  const cerrarModal = (index, indexFila) => {
    setIndiceFila('')
    setModalPagosAbierto(false)
  }

  var servicios = new serviciosFacturas();  
  const obtenerRecepciones =  async () => {    
    var filasLocal = [];         
    await servicios.getRecepcionesList(tipo).then((res) => {  
      console.log(res)
      const resOrdenado = res.sort((a, b) => b.fecha-a.fecha)
      setRecepcionesRes(resOrdenado)
      for (var i = 0; i < resOrdenado.length; i++) {
        let recepcion = resOrdenado[i]
        var fila = [[recepcion.numero, recepcion.fechaAsString], recepcion.numero, recepcion.fechaAsString, recepcion.pepObra, recepcion.montoAsString, recepcion.estado, recepcion.numeroOC]                            
        filasLocal.push(fila) 
      }                      
      setRecepcionesFilas(filasLocal)  
    });           
  }     

  const filtrarData = (dataFiltrada) => {    
    var filasLocal = [];    
    const resOrdenado = dataFiltrada.sort((a, b) => b.fecha-a.fecha)
    console.log(resOrdenado)
    setFiltroResponse(resOrdenado)
    for (var i = 0; i < dataFiltrada.length; i++) {
      let recepcion = dataFiltrada[i]
      var fila = [[recepcion.numero, recepcion.fechaAsString], recepcion.numero, recepcion.fechaAsString, recepcion.pepObra, recepcion.montoAsString, recepcion.estado, recepcion.numeroOC]                            
      filasLocal.push(fila) 
    }                      
    setRecepcionesFilas(filasLocal)  
    console.log(filasLocal)   
  }
    
  const titulos = [
    'N°/Fecha', 
    '#',
    'Fecha',    
    'Obra',
    'Monto', 
    'Estado', 
    '# OC',    
    ''
  ];
  const menuTitulos = ['DETALLE','ORDEN DE COMPRA']
  const menuFunciones = [
    function(index, indexFila) {abrirModal(index, indexFila)},
    function(index, indexFila) {
      console.log(index, indexFila)
      history.push({
        pathname: "/orden-de-compra",
        state: {
          numeroOC: recepcionesFilas[index][6],
          obra: recepcionesFilas[index][3]
        }
      })
    },    
  ];
  const verDetalleFunction = function (index) {
    history.push({
      pathname: "/orden-de-compra",
      state: {
        numeroOC: recepcionesFilas[index][7],
        obra: recepcionesFilas[index][4]
      }
    })
  }

  const toggleFiltro = () => {
    setFiltroActive(!filtroActive)
  }

  return(
    <div className="fondo-app compra recepciones con-bottom-bar flex flex-column">
      <AppBar />        
      <div className={`contenido-ventana${filtroActive ? ' filtro-active' : ''}`}>
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Entregas realizadas</h2>     
          {recepcionesFilas && <div className="titulo-tabla__botones flex flex-row">
            <BotonFiltrar funcion={toggleFiltro} />     
            <FiltroInput data={recepcionesRes} funcion={filtrarData} />                                                             
          </div>}     
        </div>             
        {recepcionesFilas ? <TablaBasica paginacion={true} titulos={titulos} dataTabla={recepcionesFilas} menuTitulos={menuTitulos} menuFunciones={menuFunciones} /* verDetalle={true} verDetalleFunction={(index, indexFila) => {verDetalleFunction(index, indexFila)}} */ /> : <CargandoCircular />}
        {indiceFila !== '' && <Modal
          open={modalPagosAbierto}
          onClose={() => cerrarModal()}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ModalDetalleOC cerrarModal={() => cerrarModal()} data={filtroResponse ? filtroResponse[indiceFila] : recepcionesRes[indiceFila]} />
        </Modal>}
      </div>
      <BottomBar />
    </div>        
  )
}

function ModalDetalleOC({cerrarModal, data}) {  
  const [filasTabla, setFilasTabla] = useState('');    

  useEffect(() => {
    obtenerRecepcionDetalle()    
    console.log(data)
  }, [])

  var servicios = new serviciosFacturas();  

  const obtenerRecepcionDetalle =  async () => {    
    await servicios.getRecepcionesDetail(data.numeroDoc, data.tipo).then((res) => {  
      console.log(res)
      var productos = res.payload  
      var filasProductosLocal = [];
      for (var i = 0; i < productos.length; i++) {
        var filaProducto = [productos[i].producto, productos[i].cantidad, [productos[i].precioUnitarioAsString, productos[i].precioTotalAsString], productos[i].precioUnitarioAsString, productos[i].precioTotalAsString]
        filasProductosLocal.push(filaProducto) 
      }                       
      setFilasTabla(filasProductosLocal)            
    });
  }  

  const filas = [
    [[data.numeroOC, 'Numero OC'], [data.fechaAsString, 'Fecha Recepción'], [data.pepObra, 'Obra']], 
    [[data.estado, 'Estado'], [data.montoAsString, 'Monto total'], [data.numero, 'Número recepción']]
  ]  
  const titulosTabla = ['Producto', 'Cantidad', 'Precio un. / Precio total', 'Precio unidad', 'Precio total']

  return(
    <div className="modal-basico modal-detalle-ordenes-compra flex flex-column">
      <Button className="modal-basico__cerrar" onClick={() => cerrarModal()}>
        <CloseIcon />
      </Button>
      <div className="modal__contenido">
        <TablaBasica dataTabla={filas} />    
        {filasTabla ? <TablaBasica titulos={titulosTabla} dataTabla={filasTabla} /> : <CargandoCircularModal />}    
      </div>      
    </div>       
  )
}