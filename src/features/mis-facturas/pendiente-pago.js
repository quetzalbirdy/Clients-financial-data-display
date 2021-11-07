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
import { faFilter, faSortAmountUp, faInfoCircle, faDollarSign, faFileInvoice} from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import ModalBasico from '../componentes-general/modals/modal-basico'
import {serviciosFacturas} from '../../api/servicios'
import {CargandoCircular} from '../componentes-general/cargador-circular'
import BotonFiltrar from '../componentes-general/boton-filtrar';
import FiltroInput from '../componentes-general/filtroInput';
import context from '../constants/Context';

export default function PendientePago() {  
  const [modalOpen, setModalOpen] = useState(false)
  const [indexModal, setIndexModal] = useState(0)
  const [numerosOC, setNumerosOC] = useState('')
  const [filas, setFilas] = useState('')
  const [dataResponse, setDataResponse] = useState('');
  const [filtroResponse, setFiltroResponse] = useState('');
  const [dataDetalle, setDataDetalle] = useState('');
  const [filtroActive, setFiltroActive] = useState(false);
  const [totalPendientePago, setTotalPendientePago] = useState('');
  const flagFactoring = (context.flagFactoring === "true")
  let history = useHistory();

  useEffect(() => {
    obtenerFacturas() 
  }, []);

  const abrirModal = (indexFila, indexBoton) => {
    setDataDetalle(filtroResponse ? filtroResponse[indexFila] : dataResponse[indexFila])
    setModalOpen(true);
    setIndexModal(indexBoton)    
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setIndexModal(0)
  };

  const cambiarIndexModal = (index) => {
    setIndexModal(index)
  }

  const generarTipo = (TipoNumero,) => {    
    switch (TipoNumero.toString()) {    
      case "BE":
      case "BG":
      case "BH":
      case "BJ":          
        return "BH"              
      case "FJ":
        return "FC"
      case "32":  
        return "FE"       
      case "33":
      case "FL":
      case "FR":
      case "FX":
      case "FP":  
      case "30":
        return "F"   
      case "34":
        return "FE"   
      case "35":
        return "B"   
      case "38":
        return "B"   
      case "39":
        return "B"   
      case "55":
      case "56":
      case "DJ":
        return "ND"               
      case "60":
      case "61":  
      case "NJ":  
      case "NL":  
      case "NR":
      case "NP":      
        return "NC"
      case "DF":      
        return "ND"
      default:
        return TipoNumero.toString()
    }
  }

  var servicios = new serviciosFacturas();  
  const obtenerFacturas =  async () => {    
    await servicios.getFacturaList(21).then((res) => {
      const resOrdenado = res.sort((a, b) => b.fechaEmision-a.fechaEmision)
      setDataResponse(resOrdenado)
      var filasLocal = [];
      var numerosOCLocal = [];
      let totalPendientePagoLocal = 0;
      let dataResponseFiltrada = [];
      for (var i = 0; i < resOrdenado.length; i++) {
        var factura = resOrdenado[i]
        if ((factura.cedida === "0") && (factura.estado === "5" || (flagFactoring && factura.estado === "F")) && (generarTipo(factura.tipoDTE) === "F" || generarTipo(factura.tipoDTE) === "FE")) {
          totalPendientePagoLocal += parseFloat(factura.monto)
          var fila = [factura.numero, factura.montoAsString, factura.fechaEmisionAsString, [factura.fechaEmisionAsString, factura.fechaVencimientoAsString], factura.fechaVencimientoAsString, factura.fechaEstimadaPagoAsString, factura.fechaReprogramacionAsString, factura.pepObra, factura.proveedor]
          filasLocal.push(fila)
          numerosOCLocal.push(factura.numeroOC)
          dataResponseFiltrada.push(factura)
        }
      }    
      setDataResponse(dataResponseFiltrada)
      setTotalPendientePago(totalPendientePagoLocal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setFilas(filasLocal)      
      setNumerosOC(numerosOCLocal)
    });
  } 

  const filtrarData = (dataFiltrada) => {    
    var filasLocal = [];
    var numerosOCLocal = [];
    let totalPendientePagoLocal = 0;
    let filtroResponseFiltrado = []
    const resOrdenado = dataFiltrada.sort((a, b) => b.fechaEmision-a.fechaEmision)
    console.log(resOrdenado)
    setFiltroResponse(resOrdenado)
    for (var i = 0; i < dataFiltrada.length; i++) {
      var factura = dataFiltrada[i]
      if ((factura.cedida === "0") && (factura.estado !== "6" && factura.estado !== "N" && factura.estado !== "C") && (generarTipo(factura.tipoDTE) === "F" || generarTipo(factura.tipoDTE) === "FE")) {
        totalPendientePagoLocal += parseFloat(factura.monto)
        var fila = [factura.numero, factura.montoAsString, factura.fechaEmisionAsString, [factura.fechaEmisionAsString, factura.fechaVencimientoAsString], factura.fechaVencimientoAsString, factura.fechaEstimadaPagoAsString, factura.fechaReprogramacionAsString, factura.pepObra, factura.proveedor]
        filtroResponseFiltrado.push(factura)
        filasLocal.push(fila)
        numerosOCLocal.push(factura.numeroOC)
      }
    }  
    setFiltroResponse(filtroResponseFiltrado)
    setFilas(filasLocal)      
    setNumerosOC(numerosOCLocal)
    setTotalPendientePago(totalPendientePagoLocal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
  }

  const toggleFiltro = () => {
    setFiltroActive(!filtroActive)
  }

  const titulos = ['#', 'Monto','Emisión', 'Emisión / Vencimiento', 'Vencimiento', 'Fecha estimada de pago', 'Reprogramada para', 'Obra', 'Proveedor',  ''];
  const menuTitulos = flagFactoring ? ['DETALLE'] : ['DETALLE', 'ORDEN DE COMPRA'];
  const menuFunciones = [
    function(indexFila, indexBoton) {abrirModal(indexFila, indexBoton)},
    /* function(indexFila, indexBoton) {abrirModal(indexFila, indexBoton)},
    function(indexFila, indexBoton) {abrirModal(indexFila, indexBoton)}, */
    function(indexFila, indexBoton) {      
      history.push({
        pathname: "/orden-de-compra",
        state: {
          numeroOC: numerosOC[indexFila],
          obra: filas[indexFila][5]
        }
      })
    },
    function() {console.log('funciona5')}
  ];  

  return(
    <div className="fondo-app factura pendiente-pago con-bottom-bar flex flex-column">
      {dataDetalle !== '' && <Modal
        open={modalOpen}
        onClose={cerrarModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalBasico cantMenu={3} cerrarModal={cerrarModal} index={indexModal} modificarIndex={cambiarIndexModal} detalleFactura={dataDetalle} />
      </Modal>}
      <AppBar />        
      <div className={`contenido-ventana${filtroActive ? ' filtro-active' : ''}`}>
        {filas ? <div>
          <div className="titulo-tabla flex flex-row align-center">
            <h2>Facturas por pagar</h2>
            <div className="titulo-tabla__botones flex flex-row">
              {/* <Button aria-haspopup="true" className="flex flex-row align-center">
                <FontAwesomeIcon icon={faSortAmountUp} style={{fontSize: '18px'}} />
                <p>Ordenar</p>
              </Button>  */}
              <BotonFiltrar funcion={toggleFiltro} />     
              <FiltroInput data={dataResponse} funcion={filtrarData} />                  
            </div>
          </div>    
          {/* <ValorTotal texto={'Total'} valorTotal={totalPendientePago ? totalPendientePago : ''}/>   */} 
          <TablaBasica paginacion={true} titulos={titulos} dataTabla={filas} menuTitulos={menuTitulos} menuFunciones={menuFunciones} esconder={8} />
          {/* <div className="boton-accion-centro flex justify-center align-center">
            <Button variant="contained">Mi cuenta corriente</Button>
          </div> */}
        </div> : <CargandoCircular />}
      </div>
      <BottomBar />
    </div>        
  )
}

