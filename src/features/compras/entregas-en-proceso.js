import React, { useState, useEffect } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import {serviciosFacturas} from '../../api/servicios'
import CloseIcon from '@material-ui/icons/Close';
import {CargandoCircular, CargandoCircularModal} from '../componentes-general/cargador-circular'
import Modal from '@material-ui/core/Modal';
import {    
  useHistory
} from "react-router-dom";
import BotonFiltrar from '../componentes-general/boton-filtrar';
import FiltroInput from '../componentes-general/filtroInput';

export default function EntregasEnProceso() {
  let history = useHistory();  
  const [tipo, setTipo] = useState(-1);
  const [recepcionesFilas, setRecepcionesFilas] = useState('');
  const [filtroResponse, setFiltroResponse] = useState('');
  const [filaDetalleIndex, setFilaDetalleIndex] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroActive, setFiltroActive] = useState(false);
  const [totalSinFacturar, setTotalSinFacturar] = useState('');
  const [respuestaList, setRespuestaList] = useState('');

  useEffect(() => {
    obtenerRecepciones() 
  }, []);

  var servicios = new serviciosFacturas();  
  const obtenerRecepciones =  async () => {    
    await servicios.getRecepcionesList(tipo/* , true */).then((res) => {     
      const resOrdenado = res.sort((a, b) => b.fecha-a.fecha) 
      setRespuestaList(resOrdenado)
      let respuestaListFiltrada = []
      var filasLocal = [];    
      let totalSinFacturarLocal = 0;  
      for (var i = 0; i < resOrdenado.length; i++) {
        var recepcion = resOrdenado[i]
        if ((recepcion.tipo === 'ML81N' && recepcion.estado === 'En aprobación')) {
          totalSinFacturarLocal += parseFloat(recepcion.monto)
          var fila = [
            recepcion.numero, 
            recepcion.fechaAsString, 
            [recepcion.numero, recepcion.fechaAsString],           
            recepcion.pepObra, 
            recepcion.montoAsString, 
            [recepcion.numeroOC, 
            recepcion.montoAsString], 
            recepcion.numeroOC,           
          ]
          respuestaListFiltrada.push(recepcion)
          filasLocal.push(fila) 
        }               
      }      
      setRespuestaList(respuestaListFiltrada)
      setTotalSinFacturar(totalSinFacturarLocal)
      setRecepcionesFilas(filasLocal)            
    });
  }
  
  const filtrarData = (dataFiltrada) => {    
    var filasLocal = [];    
    let totalSinFacturarLocal = 0; 
    let respuestaListFiltrada = []
    const resOrdenado = dataFiltrada.sort((a, b) => b.fecha-a.fecha)
    console.log(resOrdenado)
    setFiltroResponse(resOrdenado)
    for (var i = 0; i < dataFiltrada.length; i++) {
      var recepcion = dataFiltrada[i]
      if ((recepcion.tipo === 'ML81N' && recepcion.estado === 'En aprobación')) {
        totalSinFacturarLocal += parseFloat(recepcion.monto)
        var fila = [
          recepcion.numero, 
          recepcion.fechaAsString, 
          [recepcion.numero, recepcion.fechaAsString],           
          recepcion.pepObra, 
          recepcion.montoAsString, 
          [recepcion.numeroOC, 
          recepcion.montoAsString], 
          recepcion.numeroOC,           
        ]
        respuestaListFiltrada.push(recepcion)
        filasLocal.push(fila) 
      }               
    }      
    setFiltroResponse(respuestaListFiltrada)
    setTotalSinFacturar(totalSinFacturarLocal)
    setRecepcionesFilas(filasLocal)   
  }

  const abrirModal = (index) => {
    setFilaDetalleIndex(index)
    setModalAbierto(true)
  }
  const cerrarModal = (index) => {
    setFilaDetalleIndex('')
    setModalAbierto(false)
  }

  const toggleFiltro = () => {
    setFiltroActive(!filtroActive)
  }  
  
  const titulos = ['#','Fecha','#/Fecha', 'Obra', 'Monto','N°OC/Monto','#OC', ''];
  const menuTitulos = ['Detalle','Orden de compra']
  const menuFunciones = [
    function(index) {
      abrirModal(index)
    },
    function(index) {  
      console.log(recepcionesFilas[index][6])  
      console.log(recepcionesFilas[index][3])  
      history.push({
        pathname: "/orden-de-compra",
        state: {
          numeroOC: recepcionesFilas[index][6],
          obra: recepcionesFilas[index][3]
        }
      })
    },    
  ];

  return(
    <div className="fondo-app entregas-en-proceso compra con-bottom-bar flex flex-column">
      <AppBar />        
      <div className={`contenido-ventana${filtroActive ? ' filtro-active' : ''}`}>
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Entregas en proceso</h2>
          {recepcionesFilas && <div className="titulo-tabla__botones flex flex-row">            
            <BotonFiltrar funcion={toggleFiltro} />    
            <FiltroInput data={respuestaList} funcion={filtrarData} />                      
          </div>}
        </div>    
        {recepcionesFilas && <ValorTotal texto={'Total entregas en proceso'} valorTotal={totalSinFacturar !== '' ? totalSinFacturar.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : ''}/>   }
        {recepcionesFilas ? <TablaBasica paginacion={true} titulos={titulos} dataTabla={recepcionesFilas} menuTitulos={menuTitulos} menuFunciones={menuFunciones} /> : <CargandoCircular />}
        {(recepcionesFilas && filaDetalleIndex !== '') && <Modal open={modalAbierto}>
          <ModalDetalleRecepcion dataRecepcion={{                    
            numero: filtroResponse ? filtroResponse[filaDetalleIndex].numero : respuestaList[filaDetalleIndex].numero,
            fecha: filtroResponse ? filtroResponse[filaDetalleIndex].fechaAsString : respuestaList[filaDetalleIndex].fechaAsString,
            monto: filtroResponse ? filtroResponse[filaDetalleIndex].montoAsString : respuestaList[filaDetalleIndex].montoAsString,
            tipo: filtroResponse ? filtroResponse[filaDetalleIndex].tipo : respuestaList[filaDetalleIndex].tipo,
            obra: filtroResponse ? filtroResponse[filaDetalleIndex].pepObra : respuestaList[filaDetalleIndex].pepObra,
            numeroOC: filtroResponse ? filtroResponse[filaDetalleIndex].numeroOC : respuestaList[filaDetalleIndex].numeroOC,
            indice: filaDetalleIndex
          }} cerrarModal={() => cerrarModal()} />
        </Modal>}
      </div>
      <BottomBar />
    </div>        
  )
}

function ModalDetalleRecepcion({cerrarModal, dataRecepcion}) {  
  const [filasProductos, setFilasProductos] = useState('');
  useEffect(() => {    
    console.log(dataRecepcion)
    obtenerRecepcionDetalle()    
  }, []);

  var servicios = new serviciosFacturas();  
  const obtenerRecepcionDetalle =  async () => {    
    await servicios.getRecepcionesDetail(dataRecepcion.numero, dataRecepcion.tipo).then((res) => {        
      console.log(res)
      var productos = res.payload  
      var filasProductosLocal = [];
      for (var i = 0; i < productos.length; i++) {
        var filaProducto = [productos[i].producto, productos[i].cantidad, [productos[i].precioUnitarioAsString, productos[i].precioTotalAsString], productos[i].precioUnitarioAsString, productos[i].precioTotalAsString]
        filasProductosLocal.push(filaProducto) 
      }                       
      setFilasProductos(filasProductosLocal)            
    });
  }  
  const filas = [
    [[dataRecepcion.numero, 'Numero GD'], [dataRecepcion.fecha, 'Fecha Recepción'], [dataRecepcion.monto, 'Monto total']],
    [[dataRecepcion.obra, 'Obra'], [dataRecepcion.numeroOC, '#OC']]
  ] 
  const filasTabla = [
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']],
    ['Clavos de acero 7 pulgadas para anclaje', '60 Kg', ['10.000', '600.000']]    
  ] 
  const titulosTabla = ['Producto', 'Cantidad', 'Precio un. / Precio total', 'Precio unidad', 'Precio total']

  return(
    <div className="modal-basico modal-detalle-ordenes-compra flex flex-column">
      <Button className="modal-basico__cerrar" onClick={() => cerrarModal()}>
        <CloseIcon />
      </Button>
      <div className="modal__contenido">
        <TablaBasica dataTabla={filas} />    
        {filasProductos ? <TablaBasica titulos={titulosTabla} dataTabla={filasProductos} /> : <CargandoCircularModal />}
      </div>      
    </div>       
  )
}