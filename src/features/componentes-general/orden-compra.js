import React, { useState, useEffect, createContext } from 'react';
import {
  BrowserRouter as Router,  
  useHistory,
  useLocation
} from "react-router-dom";
import AppBar from './appBar';
import BottomBar from './bottomBar';
import TablaBasica from './tabla-basica';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown} from '@fortawesome/free-solid-svg-icons'
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import {serviciosFacturas} from '../../api/servicios'
import {CargandoCircular, CargandoCircularModal} from './cargador-circular'
import Detalle from './modals/detalle'
import TablaVacia from './tabla-vacia'

const Accordion = withStyles({
  root: {
    /* border: '1px solid rgba(0, 0, 0, .125)', */
    boxShadow: 'none',
    backgroundColor: '#EEFAFC',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
      backgroundColor: '#FEB969',     
      color: '#fff',
    },    
    '&$expanded svg': {      
      transform: 'rotate(180deg)',       
    },    
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    /* borderBottom: '1px solid rgba(0, 0, 0, .125)', */
    marginBottom: -1,
    minHeight: 48,
    '&$expanded': {
      minHeight: 48,

    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function OrdenDeCompra() {
  const [modalRecepcionesAbierto, setModalRecepcionesAbierto] = useState(false);
  const [modalFacturasAsociadasAbierto, setModalFacturasAsociadasAbierto] = useState(false);
  const [modalPagosAbierto, setModalPagosAbierto] = useState(false);
  const [modalFacturasEmitirAbierto, setModalFacturasEmitirAbierto] = useState(false);
  const [filasOC, setFilasOC] = useState('');  

  const [recepcionesResp, setRecepcionesResp] = useState('');
  const [filasRecepcionesOC, setFilasRecepcionesOC] = useState('');
  const [filasFacturasAsociadas, setFilasFacturasAsociadas] = useState('');
  const [filasPagosAsociados, setFilasPagosAsociados] = useState('');
  const [filasFacturasEmitir, setFilasFacturasEmitir] = useState('');
  const [indiceFilaVer, setIndiceFilaVer] = useState('');
  const [dataResponseFacturaRecibida, setDataResponseFacturaRecibida] = useState('');
  const [dataResponseFacturasEmitir, setDataResponseFacturasEmitir] = useState('');
  const [prodRecibibidosTotal, setProdRecibibidosTotal] = useState('');
  const [facturasRecibidasTotal, setFacturasRecibidasTotal] = useState('');
  const [pagosRealizadosTotal, setPagosRealizadosTotal] = useState('');
  const [facturasRecibirTotal, setFacturasRecibirTotal] = useState('');
  const [llamadoServicio, setLlamadoServicio] = useState([]);
  const [llamadoObtenerOc, setLlamadoObtenerOc] = useState('');
  const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);
  const {state} = useLocation();
  const { numeroOC, obra, dataOC } = state;  

  useEffect(() => {     
    obtenerOC(numeroOC)                     
    function handleResize() {
      setAnchoPantalla(window.innerWidth)  
    } 
    window.addEventListener('resize', handleResize)
  }, [prodRecibibidosTotal, facturasRecibidasTotal, pagosRealizadosTotal]);

  const evaluarDesktop = () => {
    if (anchoPantalla > 500) {
      obtenerFacturasAsociadas(numeroOC);
      obtenerPagosAsociados(numeroOC)
      obtenerFacturasEmitir(numeroOC)
    }
  }

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel, numeroOC) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    switch (panel) {
      case 'panel1':
        obtenerFacturasAsociadas(numeroOC);
        break;
      case 'panel2':
        obtenerFacturasAsociadas(numeroOC);
        break;
      case 'panel3':
        obtenerPagosAsociados(numeroOC);
        break;
      case 'panel4':
        obtenerFacturasEmitir(numeroOC)
        break;
    }
  };  

  const generarEstado = (estadoNumero) => {    
    switch (estadoNumero.toString()) {              
      case "01":
      case "02":
      case "03":
      case "04":            
        return "En aprobación"
      case "05": 
      case "F": 
        return "Aprobada"
      case "06":
      case "N":
        return "Rechazada"
      case "07":
      case "08":
        return "En ejecución"    
      case "09":
        return "Cerrada"
      case "C":
        return "Pagada"
    }
  }

  var servicios = new serviciosFacturas();  
  const obtenerOC =  async (numOC) => {        
    if (dataOC) {
      console.log("estado", dataOC.estado)
      let filasOCLocal = [
        [
          [dataOC.numeroOC, 'Numero OC'],
          [dataOC.fechaEmisionAsString, 'Fecha emisión'], 
          [generarEstado(dataOC.estado), 'Estado'],
          /* [dataOC.total, 'Monto total'] */
        ],
        [
          [prodRecibibidosTotal !== 0 ? `$${prodRecibibidosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto neto recibido'],
          [facturasRecibidasTotal !== 0 ? `$${facturasRecibidasTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto total facturado'], 
          [pagosRealizadosTotal !== 0 ? `$${pagosRealizadosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto total pagado']
        ],
        [
          /* [dataOC.estado, 'Estado'], */
          [dataOC.tipo, 'Tipo'],
          [dataOC.contacto, 'Contacto'],
          ''
        ], 
      ];            
      setFilasOC(filasOCLocal)    
      if (llamadoServicio.length === 0) {
        console.log('numero oc', numeroOC)      
        obtenerRecepcionesOC(numeroOC)
        evaluarDesktop()       
      }             
    } else {
      if (filasOC === '') {
        setLlamadoObtenerOc('llamado')
        await servicios.getOrdenCompraDetalle(numOC).then((res) => {   
          console.log('productos recibidos1', prodRecibibidosTotal)
          var ordenCompra = res
          let filasOCLocal = [
            [
              [numeroOC, 'Numero OC'],
              [ordenCompra.fechaEmisionAsString, 'Fecha emisión'], 
              [generarEstado(ordenCompra.estado), 'Estado'],
              /* [ordenCompra.total, 'Monto total'] */
            ],
            [            
              [prodRecibibidosTotal !== 0 ? `$${prodRecibibidosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto neto recibido'],
              [facturasRecibidasTotal !== 0 ? `$${facturasRecibidasTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto total facturado'], 
              [pagosRealizadosTotal !== 0 ? `$${pagosRealizadosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto total pagado']          
            ],
            [
              /* [ordenCompra.estado, 'Estado'], */
              [ordenCompra.tipo, 'Tipo'],
              [ordenCompra.contacto, 'Contacto'],
              ''
            ], 
          ];      
          console.log('filas local2', filasOCLocal)      
          setFilasOC(filasOCLocal)                                  
        });
        if (llamadoServicio.length === 0) {
          console.log('numero oc', numeroOC)      
          obtenerRecepcionesOC(numeroOC)
          evaluarDesktop()       
        }  
      } else {
        console.log('productos recibidos2', prodRecibibidosTotal)
        let filasLocal = [...filasOC]
        console.log('filas abs', filasLocal)
        filasLocal[1] = [            
          [prodRecibibidosTotal !== 0 ? `$${prodRecibibidosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto neto recibido'],
          [facturasRecibidasTotal !== 0 ? `$${facturasRecibidasTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto total facturado'], 
          [pagosRealizadosTotal !== 0 ? `$${pagosRealizadosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0', 'Monto total pagado']          
        ]
        console.log('filas local2', filasLocal)
        setFilasOC(filasLocal)    
      }   
    }    
  }

  const obtenerRecepcionesOC =  async (numOC) => { 
    if (!llamadoServicio.includes('obtenerRecepcion')) {
      setLlamadoServicio(oldLlamado => [...oldLlamado, 'obtenerRecepcion'])
      await servicios.getRecepcionesListByOC(numOC).then((res) => {          
        var recepciones = res 
        setRecepcionesResp(recepciones)
        var filasRecepcionesLocal = [];  
        var montoTotalLocal = 0; 
        for (var i = 0; i < recepciones.length; i++) {
          var recepcion = recepciones[i]
          var fila = [recepcion.fechaAsString, recepcion.numero, recepcion.estado, recepcion.montoAsString]
          filasRecepcionesLocal.push(fila)
          montoTotalLocal += recepcion.monto
        }
        setFilasRecepcionesOC(filasRecepcionesLocal)   
        setProdRecibibidosTotal(montoTotalLocal)                  
      });
    }               
  }

  const obtenerFacturasAsociadas =  async (numOC) => {     
    if (!llamadoServicio.includes('facturasRecibidasTotal')) {
      console.log('llamado servicio', llamadoServicio)
      setLlamadoServicio(oldLlamado => [...oldLlamado, 'facturasRecibidasTotal'])
      await servicios.getListByOC(numOC).then((res) => {          
        setDataResponseFacturaRecibida(res)
        var factAsociadas = res
        var filasFacturasAsociadasLocal = [];  
        var montoTotalLocal = 0;  
        for (var i = 0; i < factAsociadas.length; i++) {
          var factura = factAsociadas[i]
          var fila = [factura.numero, factura.fechaEmisionAsString, factura.fechaVencimientoAsString, factura.montoAsString, generarEstado(factura.estado)]
          filasFacturasAsociadasLocal.push(fila)
          montoTotalLocal += factura.monto
        }
        setFilasFacturasAsociadas(filasFacturasAsociadasLocal)   
        setFacturasRecibidasTotal(montoTotalLocal)              
      });  
    }         
  }
  
  const obtenerPagosAsociados =  async (numOC) => {    
    if (!llamadoServicio.includes('pagosRealizadosTotal')) {
      setLlamadoServicio(oldLlamado => [...oldLlamado, 'pagosRealizadosTotal'])
      await servicios.getPagosListByOC(numOC).then((res) => {  
        var pagos = res.payload    
        var filasPagosAsociadosLocal = [];  
        var montoTotalLocal = 0;  
        for (var i = 0; i < pagos.length; i++) {
          var pago = pagos[i]
          var fila = [pago.fechaAsString, pago.medioPago, pago.montoAsString, pago.documentosAsociados.length > 3 ? [pago.documentosAsociados[0], pago.documentosAsociados[1], pago.documentosAsociados[2], '...'] : pago.documentosAsociados]
          filasPagosAsociadosLocal.push(fila)
          montoTotalLocal += pago.monto
        }
        setFilasPagosAsociados(filasPagosAsociadosLocal)   
        setPagosRealizadosTotal(montoTotalLocal)               
      }); 
    }       
  }

  const obtenerFacturasEmitir =  async (numOC) => {    
    if (!llamadoServicio.includes('facturasRecibirTotal')) {
      setLlamadoServicio(oldLlamado => [...oldLlamado, 'facturasRecibirTotal'])
      await servicios.getRecepcionesListByOC(numOC).then((res) => {  
        console.log(res)
        setDataResponseFacturasEmitir(res)
        var facturasRecibir = res    
        var filasFacRecLocal = [];   
        var montoTotalLocal = 0;  
        for (var i = 0; i < facturasRecibir.length; i++) {
          var factura = facturasRecibir[i]
          if (factura.estado === "Aceptada") {
            var fila = [factura.numero, factura.fechaAsString, factura.fechaAsString, factura.montoAsString]
            filasFacRecLocal.push(fila)
            montoTotalLocal += factura.monto
          }        
        }
        setFilasFacturasEmitir(filasFacRecLocal)            
        setFacturasRecibirTotal(montoTotalLocal)      
      });  
    }      
  }
  
  const recepcionesTitulos = ['Fecha', 'Número Doc.', 'Estado', 'Monto total neto', ''];  
  const facturasAsociadasTitulos = ['#', 'F. emisión', 'F. vencimiento', 'Monto total', 'Estado', ''];  
  const pagosTitulos = ['Fecha', 'Medio de pago', 'Monto total', 'Docs. pagados', ''];  
  const facturasEmitirTitulos = ['Número recepción', 'Fecha recepción', 'Monto total', ''];       

  const abrirModal = (index, indiceFila) => {    
    console.log(index, indiceFila)
    if (indiceFila !== null) {
      setIndiceFilaVer(indiceFila) 
    }           
    switch (index) {
      case 0:        
        setModalRecepcionesAbierto(true);
        break;
      case 1:
        setModalFacturasAsociadasAbierto(true);
        break;   
      case 2:
        setModalPagosAbierto(true);
        break; 
      case 3:
        setModalFacturasEmitirAbierto(true);
        break;
    }    
  };
  const cerrarModal = (index) => {
    setIndiceFilaVer('')
    switch (index) {
      case 0:
        setModalRecepcionesAbierto(false);
        break;
      case 1:
        setModalFacturasAsociadasAbierto(false);
        break;   
      case 2:
        setModalPagosAbierto(false);
        break; 
      case 3:
        setModalFacturasEmitirAbierto(false);
        break;
    }     
  };

  return(
    <div className="fondo-app compra  orden-compra con-bottom-bar flex flex-column">
      <AppBar />        
      {anchoPantalla < 500 ?
        <div className="contenido-ventana"> 
          {filasOC ? <TablaBasica dataTabla={filasOC}/> : <CargandoCircular />}
          {(dataOC || obra) ? <div className="medio-pago">
            <p>{dataOC ? dataOC.pepObra : obra}</p>
            <p>Obra</p>
          </div> : ''}   
          <div>
            {/* Productos o servicios recibidos */}
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1', numeroOC)}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography>Productos o servicios recibidos</Typography><FontAwesomeIcon icon={faChevronDown} style={{fontSize: '18px'}} />                
              </AccordionSummary>              
              <AccordionDetails>
                <div className='panel-contenido'>{filasRecepcionesOC ? (filasRecepcionesOC.length > 0 ? <TablaBasica titulos={recepcionesTitulos} dataTabla={filasRecepcionesOC} verDetalle={true} verDetalleFunction={(index) => abrirModal(0, index)} /> : <TablaVacia />) : <CargandoCircularModal />}    </div>
                {(filasRecepcionesOC && filasRecepcionesOC.length > 0 && ((indiceFilaVer !== ''))) && <Modal
                  open={modalRecepcionesAbierto}
                  onClose={() => cerrarModal(0)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <ModalRecepcionesAsociadas dataRecepcion={{                    
                    numeroDoc: recepcionesResp[indiceFilaVer].numeroDoc,
                    fecha: recepcionesResp[indiceFilaVer].fechaAsString,
                    monto: recepcionesResp[indiceFilaVer].montoAsString,
                    tipo: recepcionesResp[indiceFilaVer].tipo,
                    indice: indiceFilaVer
                  }} cerrarModal={() => cerrarModal(0)} 
                  />
                </Modal>}
              </AccordionDetails>
            </Accordion>

            {/* Facturas recibidas */}
            <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2', numeroOC)}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography>Facturas recibidas</Typography><FontAwesomeIcon icon={faChevronDown} style={{fontSize: '18px'}} />
                {/* <Typography>Facturas asociadas</Typography><FontAwesomeIcon icon={faChevronDown} style={{fontSize: '18px'}} /> */}
              </AccordionSummary>
              <AccordionDetails>
              <div className='panel-contenido'>{filasFacturasAsociadas ? (filasFacturasAsociadas.length > 0 ? <TablaBasica titulos={facturasAsociadasTitulos} dataTabla={filasFacturasAsociadas} verDetalle={true} verDetalleFunction={(index) => abrirModal(1, index)} /> : <TablaVacia />) : <CargandoCircularModal />}</div>
                {(filasFacturasAsociadas && filasFacturasAsociadas.length > 0  && ((indiceFilaVer !== ''))) && filasFacturasAsociadas[indiceFilaVer] && <Modal
                  open={modalFacturasAsociadasAbierto}
                  onClose={() => cerrarModal(1)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <ModalFacturasAsociadas cerrarModal={() => cerrarModal(1)} numeroFactura={filasFacturasAsociadas[indiceFilaVer][0]} detalleFactura={dataResponseFacturaRecibida[indiceFilaVer]} />
                </Modal>}
              </AccordionDetails>
            </Accordion>

            {/* Pagos realizados */}
            <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3', numeroOC)}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <Typography>Pagos realizados</Typography><FontAwesomeIcon icon={faChevronDown} style={{fontSize: '18px'}} />
                {/* <Typography>Pagos asociados</Typography><FontAwesomeIcon icon={faChevronDown} style={{fontSize: '18px'}} /> */}
              </AccordionSummary>
              <AccordionDetails>
                <div className="panel-contenido">{filasPagosAsociados ? (filasPagosAsociados.length !== 0 ? <TablaBasica titulos={pagosTitulos} dataTabla={filasPagosAsociados} /* verDetalle={true} */ verDetalleFunction={(index) => abrirModal(2, index)} />  : <TablaVacia />) : <CargandoCircularModal /> }</div>
                {filasPagosAsociados && filasPagosAsociados.length > 0 && <Modal
                  open={modalPagosAbierto}
                  onClose={() => cerrarModal(2)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <ModalPagos cerrarModal={() => cerrarModal(2)} />
                </Modal>}
              </AccordionDetails>
            </Accordion>

            {/* Facturas por recibir */}
            <Accordion square expanded={expanded === 'panel4'} onChange={handleChange('panel4', numeroOC)}>
              <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                <Typography>Facturas por recibir</Typography><FontAwesomeIcon icon={faChevronDown} style={{fontSize: '18px'}} />                
              </AccordionSummary>
              <AccordionDetails>
                <div className="panel-contenido">{filasFacturasEmitir ? (filasFacturasEmitir.length > 0 ? <TablaBasica titulos={facturasEmitirTitulos} dataTabla={filasFacturasEmitir} verDetalle={true} verDetalleFunction={(index) => abrirModal(3, index)} /> : <TablaVacia />) : <CargandoCircularModal />}  </div>
                {(filasFacturasEmitir && filasFacturasEmitir.length > 0 && ((indiceFilaVer !== ''))) && filasFacturasEmitir[indiceFilaVer] && <Modal
                  open={modalFacturasEmitirAbierto}
                  onClose={() => cerrarModal(3)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <ModalFacturasEmitir cerrarModal={() => cerrarModal(3)} numeroFactura={filasFacturasEmitir[indiceFilaVer][0]} detalleFactura={dataResponseFacturasEmitir[indiceFilaVer]} />
                </Modal>}
              </AccordionDetails>
            </Accordion>
          </div>   
        </div>
      :
        <div>
          <div className="titulo-tabla flex flex-row align-center"></div>   
          <div className="contenido-ventana"> 
            {filasOC ? <TablaBasica dataTabla={filasOC}/> : <CargandoCircular />}
            <div className="cajas">
              {/* Productos o servicios recibidos */}
              <div className="caja">
                <div className="head">
                  <h1>Productos o servicios recibidos</h1>
                  <div className="numero">
                    {prodRecibibidosTotal !== 0 ? `$${prodRecibibidosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0'}
                  </div>
                </div>
                <div className="tabla">
                  {filasRecepcionesOC ? (filasRecepcionesOC.length > 0 ? <TablaBasica titulos={recepcionesTitulos} dataTabla={filasRecepcionesOC} verDetalle={true} verDetalleFunction={(index) => abrirModal(0, index)} /> : <TablaVacia />) : <CargandoCircularModal />}  
                  {(filasRecepcionesOC && filasRecepcionesOC.length > 0 && (indiceFilaVer !== '')) ? <Modal
                    open={modalRecepcionesAbierto}
                    onClose={() => cerrarModal(0)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <ModalRecepcionesAsociadas dataRecepcion={{                    
                      numeroDoc: recepcionesResp[indiceFilaVer].numeroDoc,
                      fecha: recepcionesResp[indiceFilaVer].fechaAsString,
                      monto: recepcionesResp[indiceFilaVer].montoAsString,
                      tipo: recepcionesResp[indiceFilaVer].tipo,
                      indice: indiceFilaVer
                    }} cerrarModal={() => cerrarModal(0)} 
                    />
                  </Modal> : <div></div>}
                </div>
              </div>

              {/* Facturas recibidas */}
              <div className="caja">
                <div className="head">
                  <h1>Facturas recibidas</h1>
                  <div className="numero">
                    {facturasRecibidasTotal !== 0 ? `$${facturasRecibidasTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0'}
                  </div>
                </div>
                <div className="tabla">
                  {filasFacturasAsociadas ? (filasFacturasAsociadas.length > 0 ? <TablaBasica titulos={facturasAsociadasTitulos} dataTabla={filasFacturasAsociadas} verDetalle={true} verDetalleFunction={(index) => abrirModal(1, index)} /> : <TablaVacia />) : <CargandoCircularModal />}
                 {(filasFacturasAsociadas && filasFacturasAsociadas.length > 0 && ((indiceFilaVer !== ''))) && filasFacturasAsociadas[indiceFilaVer] && <Modal
                  open={modalFacturasAsociadasAbierto}
                  onClose={() => cerrarModal(1)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  >
                    <ModalFacturasAsociadas cerrarModal={() => cerrarModal(1)} numeroFactura={filasFacturasAsociadas[indiceFilaVer][0]} detalleFactura={dataResponseFacturaRecibida[indiceFilaVer]} />
                  </Modal>}
                </div>
              </div>

              {/* Pagos realizados */}
              <div className="caja">
                <div className="head">
                  <h1>Pagos realizados</h1>
                  <div className="numero">
                    {pagosRealizadosTotal !== 0 ? `$${pagosRealizadosTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0'}
                  </div>
                </div>
                <div className="tabla">
                  {filasPagosAsociados ? (filasPagosAsociados.length !== 0 ? <TablaBasica titulos={pagosTitulos} dataTabla={filasPagosAsociados} /* verDetalle={true} */ verDetalleFunction={(index) => abrirModal(2, index)} />  : <TablaVacia />) : <CargandoCircularModal /> }
                  {filasPagosAsociados && filasPagosAsociados.length > 0 && <Modal
                    open={modalPagosAbierto}
                    onClose={() => cerrarModal(2)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <ModalPagos cerrarModal={() => cerrarModal(2)} />
                  </Modal>}
                </div>
              </div>

              {/* Facturas por recibir */}
              <div className="caja">
                <div className="head">
                  <h1>Facturas por recibir</h1>
                  <div className="numero">
                    {facturasRecibirTotal !== 0 ? `$${facturasRecibirTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}` : '$0'}
                  </div>
                </div>
                <div className="tabla">
                  {filasFacturasEmitir ? (filasFacturasEmitir.length > 0 ? <TablaBasica titulos={facturasEmitirTitulos} dataTabla={filasFacturasEmitir} verDetalle={true} verDetalleFunction={(index) => abrirModal(3, index)} /> : <TablaVacia />) : <CargandoCircularModal />}  
                  {(filasFacturasEmitir && filasFacturasEmitir.length > 0 && ((indiceFilaVer !== ''))) && filasFacturasEmitir[indiceFilaVer] && <Modal
                    open={modalFacturasEmitirAbierto}
                    onClose={() => cerrarModal(3)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <ModalFacturasEmitir cerrarModal={() => cerrarModal(3)} numeroFactura={filasFacturasEmitir[indiceFilaVer][0]} detalleFactura={dataResponseFacturasEmitir[indiceFilaVer]} />
                  </Modal>}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <BottomBar />
    </div>        
  )
}

function ModalRecepcionesAsociadas({cerrarModal, dataRecepcion}) {  
  const [filasProductos, setFilasProductos] = useState('');
  useEffect(() => {    
    console.log(dataRecepcion)
    obtenerRecepcionDetalle()    
  }, []);

  var servicios = new serviciosFacturas();  
  const obtenerRecepcionDetalle =  async () => {    
    await servicios.getRecepcionesDetail(dataRecepcion.numeroDoc, dataRecepcion.tipo).then((res) => {  
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
    [[dataRecepcion.numeroDoc, 'Numero doc'], [dataRecepcion.fecha, 'Fecha Recepción'], [dataRecepcion.monto, 'Monto total']]
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
function ModalFacturasAsociadas({cerrarModal, numeroFactura, detalleFactura}) {   
  useEffect(() => {
    console.log(detalleFactura)       
  }, [])
  

  return(
    <div className="modal-basico modal-detalle-ordenes-compra flex flex-column">
      <Button className="modal-basico__cerrar" onClick={() => cerrarModal()}>
        <CloseIcon />
      </Button>
      <div className="modal__contenido">
        <Detalle num={numeroFactura} dataFactura={detalleFactura} />   
      </div>      
    </div>    
   )         
}

function ModalPagos(props) {    
  const filas = [
    [['pago', 'Numero GD'], ['01/11/20', 'Fecha Recepción'], ['999.990', 'Monto total']]
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
  const titulosTabla = ['Producto', 'Cantidad', 'Precio']

  return(
    <div className="modal-basico modal-detalle-ordenes-compra flex flex-column">
      <Button className="modal-basico__cerrar" onClick={() => props.cerrarModal()}>
        <CloseIcon />
      </Button>
      <div className="modal__contenido">
        <TablaBasica dataTabla={filas} />    
        <TablaBasica titulos={titulosTabla} dataTabla={filasTabla} />    
      </div>      
    </div>       
  )
}

function ModalFacturasEmitir({cerrarModal, numeroFactura, detalleFactura}) { 
  useEffect(() => {    
    console.log(numeroFactura)    
  }, []);     

  return(
    <div className="modal-basico modal-detalle-ordenes-compra flex flex-column">
      <Button className="modal-basico__cerrar" onClick={() => cerrarModal()}>
        <CloseIcon />
      </Button>
      <div className="modal__contenido">
        <Detalle num={numeroFactura} dataFactura={detalleFactura} />
        {/* <TablaBasica dataTabla={filas} />    
        <TablaBasica titulos={titulosTabla} dataTabla={filasTabla} />  */}   
      </div>      
    </div>       
  )
}
