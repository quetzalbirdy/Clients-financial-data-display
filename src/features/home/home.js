import React, { useState, useEffect } from 'react';
import AppBar from '../componentes-general/appBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice, faFileUpload, faShoppingCart, faHandshake, faSearch, faCaretDown, faHistory, faFileInvoiceDollar, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import Modal from '@material-ui/core/Modal';
import historysvg from '../../assets/img/history.svg';
import budget from '../../assets/img/budget.svg';
import iconCompras from '../../assets/img/icon_compras.svg';
import iconFacturas from '../../assets/img/icon_facturas.svg';
import {serviciosFacturas} from '../../api/servicios'
import context from '../constants/Context';
import { CargandoCircular, CargandoCircularModal } from '../componentes-general/cargador-circular';

export default function Home() {
  
  var misFacturas = ['pendiente pago', 'facturas actuales', 'pronto pago', 'facturas cedidas', 'cuenta corriente', 'historia de facturas',];
  var docApoyo = ['subir documentos', 'hoja de ruta'];
  var compras = ['pagos', 'sin facturar', 'ordenes de compra', 'recepciones'];
  var miRelacionEbco = ['perfil', 'evaluación', 'lo que ofrezco'];
  let history = useHistory();
  const [subMenuActivo, setSubMenuActivo] = useState(misFacturas)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSinResOpen, setModalSinResOpen] = useState(false)
  const [filtroFactura, setFiltroFactura] = useState(true)
  const [filtroOrdenCompra, setFiltroOrdenCompra] = useState(false)  
  const [valorBuscar, setValorBuscar] = useState('');
  const [modalCargandoOpen, setModalCargandoOpen] = useState('');  
  const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);
  const flagFactoring = (context.flagFactoring === "true")

  useEffect(() => {
    function handleResize() {
      setAnchoPantalla(window.innerWidth)  
    } 
    window.addEventListener('resize', handleResize)
  }, [])

  const handleChange = e => { setValorBuscar(e.target.value) }

  const onSelectFiltroBusqueda = (filtro) => {
    if (filtro == 'factura') {
      setFiltroFactura(true)
      setFiltroOrdenCompra(false)      
      cerrarModal()
    } else if (filtro == 'ordenCompra') {
      setFiltroFactura(false)
      setFiltroOrdenCompra(true)      
      cerrarModal()
    } else {
      setFiltroFactura(false)
      setFiltroOrdenCompra(false)      
      cerrarModal()
    }
  }

  var servicios = new serviciosFacturas();  

  const empezarBusqueda = async (val) => {       
    abrirModal(true)
    if (val && filtroFactura) {       
      await servicios.getFacturaReference(val).then((res) => {
        console.log(res)
        if (/* res.message &&  */res.code === 0) {
          getFacturaDetalle(res.payload)        
        } else {
          cerrarModal(true)
          setModalSinResOpen(true)          
        }
      })      
    } else if (val && filtroOrdenCompra) {
      console.log(val)
      abrirModal(true)
      await servicios.getOrdenCompraDetalle(val).then((res) => {
        console.log(res)
        let ocEncontrada = res
        if (!Object.keys(ocEncontrada).length) {
          cerrarModal(true)
          setModalSinResOpen(true)  
        } else {
          console.log(ocEncontrada)
          history.push({
            pathname: "/orden-de-compra",
            state: {              
              dataOC: ocEncontrada,
              numeroOC: ocEncontrada.numeroOC
            }
          }) 
        }                   
      })               
    }
  }  
  
  const getFacturaDetalle = async (numeroDoc) => {    
    await servicios.getFacturaDetalle(numeroDoc).then((respuesta) => {
      if (respuesta.payload === '') {
        setModalSinResOpen(true) 
      } else {
        history.push({
          pathname: "/historia-de-facturas",
          state: {
            facturaEncontrada: respuesta.payload
          }
        });
      }      
    })
  }
  
  const onSeleccionMenu = (menuItem) => {
    setSubMenuActivo(menuItem)        
  }
    
  const abrirModal = (cargando) => {  
    if (cargando === true) {
      setModalCargandoOpen(true);       
    } else {
      setModalOpen(true);   
    }         
  };

  const cerrarModal = (cargando) => { 
    if (cargando === true) {
      setModalCargandoOpen(false)
    } else {
      setModalOpen(false);    
    }      
  };

  const cerrarSinResModal = () => { 
    setModalSinResOpen(false);       
  };

  const navCompras = (index) => {
    console.log(index)
    switch (index) {
      case 0:
        history.push("/pagos");
        break;
      case 1:
        history.push("/sin-facturar");
        break;
      case 2:
        history.push({
          pathname: "/ordenes-compra",
          state: {
            valorBusqueda: ''
          }
        });  
        break;
      case 3:
        history.push("/recepciones");
        break;
      case 4:
        history.push("/entregas-en-proceso")
        break;
    }    
  }

  const navFacturas = (index) => {
    switch (index) {
      case 0:
        history.push("/pendiente-pago");
        break;
      case 1:
        history.push("/facturas-actuales");
        break; 
      case 2:
        history.push("/cuenta-corriente");
        break; 
      case 3:
        history.push("/historia-de-facturas");
        break;
      case 4:
        history.push("/pronto-pago");
        break;        
    }    
  }

  var servicios = new serviciosFacturas();  
  const getObra = async () => {
    await servicios.getObraPep().then((res) => {
      console.log(res)
    })
  }

  return(
    <div>
      <Modal
        open={modalSinResOpen}
        onClose={cerrarSinResModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="modal-basico select-busqueda__modal flex flex-column">
          <p>No se encontraron resultados</p>   
          <div className="select-busqueda__modal__botones flex flex-column">
              <Button onClick={cerrarSinResModal}>
                Ok
              </Button>                                                 
            </div>               
        </div>
      </Modal>
      <Modal
        open={modalCargandoOpen}
        onClose={() => cerrarModal(true)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CargandoCircularModal />
      </Modal>
      {anchoPantalla < 500 ?

        <div className="fondo-app nuevoHome">
          <AppBar />
          
          <div className="contenido-ventana flex flex-column">
            <div className="barra-busqueda flex align-center">
              <div className="busqueda">
                <input type="text" placeholder="Buscar" value={valorBuscar} onChange={handleChange} />
              </div>              
              <Modal
                open={modalOpen}
                onClose={cerrarModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div className="modal-basico select-busqueda__modal flex flex-column">
                  <p>¿Qué quieres buscar?</p>
                  <div className="select-busqueda__modal__botones flex flex-column">
                    <Button className={filtroFactura ? 'activo' : ''} onClick={() => onSelectFiltroBusqueda('factura')}>
                      Factura
                    </Button>
                    <Button className={filtroOrdenCompra ? 'activo' : ''} onClick={() => onSelectFiltroBusqueda('ordenCompra')}>
                      Orden de compra
                    </Button>                                   
                  </div>
                </div>
              </Modal>              
              <Button className="select-busqueda flex flex-row align-center" onClick={abrirModal}>
                <p>{filtroFactura || filtroOrdenCompra ? (filtroFactura ? 'Factura' : 'Orden de compra') : ''}</p><FontAwesomeIcon icon={faCaretDown} style={{fontSize: '20px'}} />                             
              </Button>
              <Button className="boton-busqueda" onClick={() => empezarBusqueda(valorBuscar)}>
                <FontAwesomeIcon icon={faSearch} style={{fontSize: '15px'}} /> 
              </Button>
            </div>
            <div className="paneles">
              <div className="panel compra">
                <div className="container">
                  <div className="box">
                    {/* <div className="icon">
                      <FontAwesomeIcon icon={faShoppingCart} style={{fontSize: '22px'}} />
                    </div> */}
                    <div className="title">
                      NUESTRA HISTORIA
                    </div>
                  </div>
                  {/* <div className="imagen">
                    <img src={img01} alt=""/>
                  </div> */}
                  <div className="menu">                    
                      <ul>
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => navCompras(2)}>OC EMITIDAS</button></li> 
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => navCompras(3)}>ENTREGAS REALIZADAS</button></li>                         
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => navFacturas(3)}>FACTURAS EMITIDAS</button></li>                                                               
                        <li><button onClick={() => navCompras(0)}>PAGOS RECIBIDOS</button></li> 
                        {/* <li><button onClick={() => navFacturas(2)}> CUENTA CORRIENTE</button></li>    */}
                      </ul>
                  </div>
                </div>
              </div>

              <div className="panel facturas">
                <div className="container">
                  
                  {/* <div className="imagen">
                    <img src={img02} alt=""/>
                  </div> */}
                  <div className="menu">                  
                    <ul>
                        <li><button onClick={() => navFacturas(0)}>FACTURAS POR PAGAR</button></li>
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => navCompras(1)}>ENTREGAS SIN FACTURAR</button></li> 
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => navCompras(4 )}>ENTREGAS EN PROCESO</button></li>  
                        {/* <li><button onClick={() => console.log("funciona")}>PENDIENTES DE ENTREGA</button></li>       */}                            
                        {/* <li><button onClick={() => navFacturas(1)}> facturas actuales</button></li>     */}                                         
                    </ul>
                  </div>
                  <div className="box">
                    {/* <div className="icon">
                      <FontAwesomeIcon icon={faFileInvoice} style={{fontSize: '28px'}} /> 
                    </div> */}
                    <div className="title">
                      PROCESOS COMERCIALES EN CURSO
                    </div>
                  </div>
                  {/* <div className="prontopago">
                    <button className="btn" onClick={() => navFacturas(4)}>
                      <div className="btn btn-light">pronto pago</div>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
            {/* <div className="info flex flex-row align-center justify-center">
              <div className="boton-accion-centro flex justify-center align-center">
                <Button variant="contained" className="info__elem" onClick={() => {getObra()}}>
                  PROCEDIMIENTOS HABITUALES
                </Button>
              </div>
              <div className="boton-accion-centro flex justify-center align-center">
                <Button variant="contained" className="info__elem">
                  POLITICAS EBCO
                </Button>
              </div>
            </div> */}
          </div>
        </div> 
        : 
        <HomeDesktop buscar={empezarBusqueda} selectFiltro={onSelectFiltroBusqueda} filtroFact={filtroFactura} filtroOC={filtroOrdenCompra} modalAbierto={modalOpen} abrirModal={abrirModal} cerrarModal={cerrarModal} />
      }
    </div>
  )
}

function HomeDesktop({buscar, filtroFact, filtroOC, selectFiltro, modalAbierto, abrirModal, cerrarModal}) {  
  const [valorBuscar, setValorBuscar] = useState('');

  const handleChange = e => { setValorBuscar(e.target.value) }
  const flagFactoring = (context.flagFactoring === "true")

  let history = useHistory();

  const navCompras = (index) => {
    switch (index) {
      case 0:
        history.push("/pagos");
        break;
      case 1:
        history.push("/sin-facturar");
        break;
      case 2:
        history.push({
          pathname: "/ordenes-compra",
          state: {
            valorBusqueda: ''
          }
        });   
        break;
      case 3:
        history.push("/recepciones");
        break;
      case 4:
        history.push("/entregas-en-proceso")
        break;
    }    
  }

  const navFacturas = (index) => {
    switch (index) {
      case 0:
        history.push("/pendiente-pago");
        break;
      case 1:
        history.push("/facturas-actuales");
        break; 
      case 2:
        history.push("/cuenta-corriente");
        break; 
      case 3:
        history.push("/historia-de-facturas");
        break;
      case 4:
        history.push("/pronto-pago");
        break;        
    }    
  }
  
  return(
    <div className="container-fluid nuevoHome">
        <div className="grid">
          <AppBar /> 
          <div className="contenido-ventana">
            <div className="barra-busqueda flex align-center">
              <div className="busqueda">
                <input type="text" placeholder="Buscar" value={valorBuscar} onChange={handleChange} />
              </div>
              <Modal
                open={modalAbierto}
                onClose={cerrarModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div className="modal-basico select-busqueda__modal flex flex-column">
                  <p>¿Qué quieres buscar?</p>
                  <div className="select-busqueda__modal__botones flex flex-column">
                    <Button className={filtroFact ? 'activo' : ''} onClick={() => selectFiltro('factura')}>
                      Factura
                    </Button> 
                    <Button className={filtroOC ? 'activo' : ''} onClick={() => selectFiltro('ordenCompra')}>
                      Orden de compra
                    </Button>                                     
                  </div>
                </div>
              </Modal>
              <Button className="select-busqueda flex flex-row align-center" onClick={abrirModal}>
                <p>{filtroFact || filtroOC ? (filtroFact ? 'Factura' : 'Orden de compra') : ''}</p><FontAwesomeIcon icon={faCaretDown} style={{fontSize: '20px'}} />                             
              </Button>
              <Button className="boton-busqueda" onClick={() => buscar(valorBuscar)}>
                <FontAwesomeIcon icon={faSearch} style={{fontSize: '15px'}} /> 
              </Button>
            </div>
          </div>
          <div className="paneles">
            <div className="panel compra">
              <div className="container">
                {/* <div className="indicador">
                  <div className="l">
                      <div className="text">TOTAL FACTURADO</div>
                      <div className="number">$526.470.000</div>                      
                  </div>
                  <div className="r">
                      <div className="text">PENDIENTE PAGO</div>
                      <div className="number">$345.980.456</div>                      
                  </div>
                  <img src={iconCompras} alt=""/>
                </div> */}
                <div className="title">
                  <div>
                    <FontAwesomeIcon icon={faHistory} style={{fontSize: '15px'}} /> 
                  </div>
                  Nuestra historia
                </div>
                <div className="menu">
                    <div className="imagen">
                      <svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><g><path d="m256 22.986v-22.986l-76.899 55.869 76.899 55.868v-22.986c98.559 0 178.742 80.183 178.742 178.742 0 98.558-80.183 178.742-178.742 178.742s-178.742-80.183-178.742-178.742h-65.765c0 135.037 109.47 244.507 244.507 244.507s244.507-109.47 244.507-244.507-109.469-244.507-244.507-244.507z" fill="#ff9368"/></g><g><path d="m256 378.449c-61.182 0-110.956-49.775-110.956-110.956s49.774-110.956 110.956-110.956 110.956 49.775 110.956 110.956-49.774 110.956-110.956 110.956z" fill="#f9ebd7"/></g><g><path d="m256 378.449c0-84.859 0-166.406 0-221.912 61.182 0 110.956 49.775 110.956 110.956s-49.774 110.956-110.956 110.956z" fill="#f3d6ae"/></g><g><path d="m274.043 309.433-33.043-26.465v-55.245h30v40.837l21.797 17.458z" fill="#f00"/></g></g><g><path d="m256 22.986v-22.986 111.737-22.986c98.559 0 178.742 80.183 178.742 178.742 0 98.558-80.183 178.742-178.742 178.742v65.765c135.037 0 244.507-109.469 244.507-244.507 0-135.037-109.469-244.507-244.507-244.507z" fill="#ff641a"/></g></g></svg>
                    </div>
                    <ul>
                      <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => {flagFactoring ? console.log('') : navCompras(2)}}>OC EMITIDAS</button></li> 
                      <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => {flagFactoring ? console.log('') : navCompras(3)}}>ENTREGAS REALIZADAS</button></li> 
                      <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => {flagFactoring ? console.log('') : navFacturas(3)}}>FACTURAS EMITIDAS</button></li>
                      <li><button onClick={() => {navCompras(0)}}>PAGOS RECIBIDOS</button></li>      
                      {/* <li><button onClick={() => navFacturas(2)}> CUENTA CORRIENTE</button></li>        */}                                                      
                    </ul>
                </div>
                {/* <div className="imagen">
                  <img src={img01} alt=""/>
                </div> */}
              </div>
            </div>
            <div className="panel facturas">
              <div className="container">
                {/* <div className="indicador">
                    <div className="l">
                      <div className="text">Número de órdenes de compra abiertas</div>
                      <div className="number">5</div>
                    </div>
                    <div className="r">
                      <div className="text">Recibido por facturar</div>
                      <div className="number">$23.788.000</div>
                    </div>
                    <img src={iconFacturas} alt=""/>
                </div> */}
                <div className="title">
                  <div>
                    <FontAwesomeIcon icon={faHandHoldingUsd} style={{fontSize: '15px'}} /> 
                  </div>
                  Procesos comerciales en curso
                </div>
                <div className="menu">                    
                    <ul>
                        <li><button onClick={() => navFacturas(0)}>FACTURAS POR PAGAR</button></li>
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => {flagFactoring ? console.log('') : navCompras(1)}}>ENTREGAS SIN FACTURAR</button></li> 
                        <li class={flagFactoring ? "boton-opaco" : ""}><button onClick={() => {flagFactoring ? console.log('') : navCompras(4)}}>ENTREGAS EN PROCESO</button></li> 
                        {/* <li><button onClick={() => console.log("funciona")}>PENDIENTES DE ENTREGA</button></li>  */}
                        {/* <li><button onClick={() => navFacturas(1)}> facturas actuales</button></li> */}                                                                        
                    </ul>
                    <div className="imagen">
                      {<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.8 497.1"><title>pay01</title><g id="Layer_2" data-name="Layer 2"><g id="Capa_1" data-name="Capa 1"><path class="cls-1" d="M242.9,163.9a19.27,19.27,0,0,0-2.4.1c1.1,56.5-2.6,112.6-1.2,169.1,1.2,0,2.3.1,3.5.1a84.65,84.65,0,0,0,.1-169.3Z"/><path class="cls-2" d="M240.5,163.9a84.65,84.65,0,0,0-1.2,169.2C237.9,276.5,241.6,220.5,240.5,163.9Z"/><path class="cls-3" d="M349.4,383.2l-103.2.2a24.17,24.17,0,0,0-7.8,47.2l107.1-13.1Z"/><path class="cls-4" d="M318.6,403.7l-103.2.2a24.17,24.17,0,0,0-7.8,47.2L314.7,438Z"/><path class="cls-5" d="M175.9,461.6a24.16,24.16,0,0,0,13.5,10.9l23.4,7.5,48.1,15.4a34.77,34.77,0,0,0,24.4-1.1l141.9-60.1-.4-78.3v-6.1l-.2-45.5-45-5.8a175.55,175.55,0,0,0-62.6,3.2l-2.6.6a147.44,147.44,0,0,0-18.2,5.7l-5.9,2.2a24.19,24.19,0,0,0-14.5,30.4,22,22,0,0,0,2,4.4,24.4,24.4,0,0,0,18.6,11.9l48.6,4.6-85.2,65-64.5-1.2a24.21,24.21,0,0,0-21.4,36.3Z"/><path class="cls-4" d="M212.9,480,261,495.4a34.77,34.77,0,0,0,24.4-1.1l141.9-60.1-.4-78.3c-.6,90.7-187.7,132.5-214,124.1Z"/><path class="cls-4" d="M426.9,349.9v0Z"/><path class="cls-6" d="M427.3,434.1l58.5,2.4-.3-61.8-.4-68.1-58.5-2.4.4,74.4Z"/><path class="cls-7" d="M427.3,434.1l58.5,2.4-.3-61.8c-29.1,20.2-58.5,3.8-58.5,3.8Z"/><path class="cls-3" d="M136.4,113.8l103.2-.2a24.17,24.17,0,0,0,7.8-47.2L140.2,79.6Z"/><path class="cls-4" d="M167.2,93.3l103.2-.2a24.17,24.17,0,0,0,7.8-47.2L171.1,59.1Z"/><path class="cls-5" d="M309.9,35.4a24.16,24.16,0,0,0-13.5-10.9L272.9,17,224.8,1.7a34.77,34.77,0,0,0-24.4,1.1L58.5,62.9l.4,78.3v6.1l.2,45.5,45,5.8a175.55,175.55,0,0,0,62.6-3.2l2.6-.6a147.44,147.44,0,0,0,18.2-5.7l5.9-2.2a24.19,24.19,0,0,0,14.5-30.4,22,22,0,0,0-2-4.4,24.4,24.4,0,0,0-18.6-11.9l-48.6-4.6,85.2-65,64.5,1.2A24.22,24.22,0,0,0,312.8,51,23.6,23.6,0,0,0,309.9,35.4Z"/><path class="cls-4" d="M272.9,17,224.8,1.7a34.77,34.77,0,0,0-24.4,1.1L58.5,62.9l.4,78.3C59.5,50.4,246.6,8.6,272.9,17Z"/><path class="cls-4" d="M58.9,147.1v0Z"/><path class="cls-8" d="M58.5,62.9,0,60.5l.3,61.8.4,68.1,58.5,2.4-.4-74.4Z"/><path class="cls-9" d="M58.5,62.9,0,60.5l.3,61.8c29.1-20.2,58.5-3.8,58.5-3.8Z"/><path d="M242.2,316.2a7.55,7.55,0,0,0,7.5-7.5v-6.8c18.3-2.9,29.4-16,31.2-28.9,2.1-14.7-7.4-27.4-24.1-32.2-11-3.2-23.2-7.1-30.3-11.7a8.06,8.06,0,0,1-3.4-8.4c.7-4.2,4.1-9.3,11.5-11.1a35.78,35.78,0,0,1,7.5-1.1h.9c10.9-.3,17.6,4.4,18.1,4.7a7.53,7.53,0,0,0,9.1-12c-.4-.3-8-6-20.4-7.4v-5.5a7.5,7.5,0,0,0-15,0v6c-1.2.2-2.4.5-3.7.8-11.9,3-20.8,12.1-22.7,23.2a22.82,22.82,0,0,0,10.1,23.4c7,4.5,16.9,8.4,34.2,13.5,9.6,2.8,14.5,8.5,13.5,15.7-1.1,8.2-9.7,16.5-23.9,16.6-11.8.1-16.4-.4-26.5-5.8a7.52,7.52,0,1,0-7.2,13.2c10.3,5.5,17,7.1,26.1,7.5v6.3a7.49,7.49,0,0,0,7.5,7.5Z"/></g></g></svg>}
                    </div>
                </div>
                {/* <div className="imagen">
                  <button className="btn" onClick={() => navFacturas(4)}>
                    <div className="btn btn-light">pronto pago</div>
                  </button>
                  <img src={img02} alt=""/>
                </div> */}
              </div>
            </div>
          </div>
          
          {/* <footer className="footer">
              <div className="container">
                <div className="accesos">
                  <button className="btn rojo">
                      Procedimientos habituales
                  </button>
                  <button className="btn rojo">
                      Politicas ebco
                  </button>
                </div>
                <section className="content-banner">
                    <div className="banner">
                        Cónocelas aqui
                    </div>
                    <div className="banner">
                        Decídete
                    </div>
                </section>
              </div>
          </footer> */}
        </div>
    </div>
  )
}