import React, { useState } from 'react';
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
import { faFileInvoice, faFileUpload, faShoppingCart, faHandshake, faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Modal from '@material-ui/core/Modal';

export default function Home() {
  
  var misFacturas = ['pendiente pago', 'facturas actuales', 'pronto pago', 'facturas cedidas', 'cuenta corriente', 'historia de facturas',];
  var docApoyo = ['subir documentos', 'hoja de ruta'];
  var compras = ['pagos', 'sin facturar', 'ordenes de compra', 'recepciones'];
  var miRelacionEbco = ['perfil', 'evaluación', 'lo que ofrezco'];
  let history = useHistory();
  const [subMenuActivo, setSubMenuActivo] = useState(misFacturas)
  const [modalOpen, setModalOpen] = useState(false)
  const [filtroFactura, setFiltroFactura] = useState(false)
  const [filtroOrdenCompra, setFiltroOrdenCompra] = useState(false)
  const [filtroPagos, setFiltroPagos] = useState(false)
  var anchoPantalla = window.innerWidth;

  const onSelectFiltroBusqueda = (filtro) => {
    if (filtro == 'factura') {
      setFiltroFactura(true)
      setFiltroOrdenCompra(false)
      setFiltroPagos(false)
      cerrarModal()
    } else if (filtro == 'ordenCompra') {
      setFiltroFactura(false)
      setFiltroOrdenCompra(true)
      setFiltroPagos(false)
      cerrarModal()
    } else {
      setFiltroFactura(false)
      setFiltroOrdenCompra(false)
      setFiltroPagos(true)
      cerrarModal()
    }
  }
  
  const onSeleccionMenu = (menuItem) => {
    setSubMenuActivo(menuItem)        
  }
    
  const abrirModal = () => {
    console.log(modalOpen);
    setModalOpen(true);    
    console.log(modalOpen);
  };

  const cerrarModal = () => {
    console.log(modalOpen);
    setModalOpen(false);
    console.log(modalOpen);
  };

  const onSeleccionSubMenu = (index) => {
    if (subMenuActivo[0] === misFacturas[0]) {
      if (subMenuActivo[index] === 'pendiente pago') {
        history.push("/pendiente-pago");
      } else if (subMenuActivo[index] === 'facturas actuales') {
        history.push("/facturas-actuales");
      } else if (subMenuActivo[index] === 'pronto pago') {
        history.push("/pronto-pago");
      } else if (subMenuActivo[index] === 'facturas cedidas') {
        history.push("/facturas-cedidas");
      } else if (subMenuActivo[index] === 'cuenta corriente') {
        history.push("/cuenta-corriente");
      } else if (subMenuActivo[index] === 'historia de facturas') {
        history.push("/historia-de-facturas");
      }
    } else if (subMenuActivo[0] === docApoyo[0]) {
      if (subMenuActivo[index] === 'subir documentos') {
        history.push("/subir-documentos");
      } else if (subMenuActivo[index] === 'hoja de ruta') {
        history.push("/hoja-de-ruta");
      }
    } else if (subMenuActivo[0] === compras[0]) {
      if (subMenuActivo[index] === 'pagos') {
        history.push("/pagos");
      } else if (subMenuActivo[index] === 'sin facturar') {
        history.push("/sin-facturar");
      } else if (subMenuActivo[index] === 'ordenes de compra') {
        history.push("/ordenes-compra");
      } else if (subMenuActivo[index] === 'recepciones') {
        history.push("/recepciones");
      }
    } else if (subMenuActivo[0] === miRelacionEbco[0]) {
      if (subMenuActivo[index] === 'perfil') {
        history.push("/perfil");
      } else if (subMenuActivo[index] === 'evaluacion') {
        history.push("/evaluacion");
      } else if (subMenuActivo[index] === 'lo que ofrezco') {
        history.push("/lo-que-ofrezco");
      }
    }
  }

  return(
    <div>
      {anchoPantalla < 500 ?
        <div className="fondo-app home">
        <AppBar />
        <div className="contenido-ventana flex flex-column">
          <div className="barra-busqueda flex align-center">
            <div className="busqueda">
              <input type="text" placeholder="Buscar"/>
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
                  <Button className={filtroPagos ? 'activo' : ''} onClick={() => onSelectFiltroBusqueda('pagos')}>
                    Pagos
                  </Button>                  
                </div>
              </div>
            </Modal>
            <Button className="select-busqueda flex flex-row align-center" onClick={abrirModal}>
              <p>Factura</p><FontAwesomeIcon icon={faCaretDown} style={{fontSize: '20px'}} />                             
            </Button>
            <Button className="boton-busqueda">
              <FontAwesomeIcon icon={faSearch} style={{fontSize: '15px'}} /> 
            </Button>
          </div>
          <div className="menu-general-mobile">
            <Button variant="contained" className={((subMenuActivo[0] === misFacturas[0]) ? 'activo ' : '') + 'menu-general__elem flex flex-column align-center justify-center'} onClick={() => onSeleccionMenu(misFacturas)}>
              <div className="menu-general__elem__row1 flex align-center">
                <FontAwesomeIcon icon={faFileInvoice} style={{fontSize: '30px'}} />  
              </div>         
              <div className="menu-general__elem__row2 flex">
                <p>STATUS DE MIS FACTURAS</p>
              </div>               
            </Button>          
            <Button variant="contained" className={((subMenuActivo[0] === docApoyo[0]) ? 'activo ' : '') + 'menu-general__elem flex align-center justify-center'} onClick={() => onSeleccionMenu(docApoyo)}>
              <div className="menu-general__elem__row1 flex align-center">
                <FontAwesomeIcon icon={faFileUpload} style={{fontSize: '30px'}} />
              </div>
              <div className="menu-general__elem__row2 flex">
                <p>DOCUMENTOS DE APOYO A LA HES</p>
              </div>                          
            </Button>
            <Button variant="contained" className={((subMenuActivo[0] === compras[0]) ? 'activo ' : '') + 'menu-general__elem flex align-center justify-center'} onClick={() => onSeleccionMenu(compras)}>
              <div className="menu-general__elem__row1 flex align-center">
                <FontAwesomeIcon icon={faShoppingCart} style={{fontSize: '30px'}} />
              </div>
              <div className="menu-general__elem__row2 flex">
                <p>COMPRAS</p>
              </div>                        
            </Button>
            <Button variant="contained" className={((subMenuActivo[0] === miRelacionEbco[0]) ? 'activo ' : '') + 'menu-general__elem flex align-center justify-center'} onClick={() => onSeleccionMenu(miRelacionEbco)}>
              <div className="menu-general__elem__row1 flex align-center">
                <FontAwesomeIcon icon={faHandshake} style={{fontSize: '30px'}} />
              </div>
              <div className="menu-general__elem__row2 flex">
                <p>MI RELACIÓN CON EBCO</p>
              </div>                        
            </Button>
          </div>
          <div className="submenu-lineas-mobile flex flex-column justify-center">
            {/* <div className="linea-horizontal"></div> */}
              <div className="sub-menu flex">
                {subMenuActivo.map((data, index) => (
                  <Button variant="contained" className={((data == 'pronto pago') ? 'pronto-pago ' : '') + "sub-menu__elem flex justify-center align-center"} onClick={() => onSeleccionSubMenu(index)}>
                    <p>{data}</p>
                  </Button>
                ))}              
              </div>
              {/* <div className="linea-horizontal"></div> */}
            </div>
            <div className="info flex flex-row align-center justify-center">
              <div className="boton-accion-centro flex justify-center align-center">
                <Button variant="contained" className="info__elem">
                  PROCEDIMIENTOS HABITUALES
                </Button>
              </div>
              <div className="boton-accion-centro flex justify-center align-center">
                <Button variant="contained" className="info__elem">
                  POLITICAS EBCO
                </Button>
              </div>
            </div>
        </div>
      </div> : 
      <HomeDesktop />}
    </div>
  )
}

function HomeDesktop() {  

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
        history.push("/ordenes-compra");
        break;
      case 3:
        history.push("/recepciones");
        break;
    }    
  }

  const navHes = (index) => {
    switch (index) {
      case 0:
        history.push("/subir-documentos");
        break;
      case 1:
        history.push("/hoja-de-ruta");
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

  const navRelacionEbco = (index) => {
    switch (index) {
      case 0:
        /* history.push("/subir-documentos"); */
        break;
      case 1:
        /* history.push("/hoja-de-ruta"); */
        break;  
      case 2:
        history.push("/lo-que-ofrezco");
        break;      
    }    
  }

  return(
    <div class="container-fluid home">
        <div class="grid">
            <AppBar />    
            <section class="cards">
                <div class="card compras">
                    <div class="indicador">
                        <div class="l">
                            <div class="text">Saldo órdenes de compra vigentes
                            </div>
                            <div class="number">$9.980.000</div>
                        </div>
                        <div class="r">
                            <div class="text">Recibido por facturar</div>
                            <div class="number">$23.788.000</div>
                        </div>
                    </div>
                    <div class="titulo">
                        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 4.25V0H0.75C0.334375 0 0 0.334375 0 0.75V15.25C0 15.6656 0.334375 16 0.75 16H11.25C11.6656 16 12 15.6656 12 15.25V5H7.75C7.3375 5 7 4.6625 7 4.25ZM9.03687 11.0003H7V13.5003C7 13.7766 6.77625 14.0003 6.5 14.0003H5.5C5.22375 14.0003 5 13.7766 5 13.5003V11.0003H2.96312C2.51687 11.0003 2.29406 10.46 2.61094 10.1453L5.62406 7.15469C5.83188 6.94812 6.1675 6.94812 6.37531 7.15469L9.38844 10.1453C9.70562 10.46 9.48312 11.0003 9.03687 11.0003ZM11.7812 3.28125L8.72188 0.21875C8.58125 0.078125 8.39063 0 8.19063 0H8V4H12V3.80938C12 3.6125 11.9219 3.42188 11.7812 3.28125Z" fill="white"/>
                            </svg>
                        COMPRAS   
                    </div>
                    <div class="menu">
                        <ul>
                          <li><button onClick={() => navCompras(0)}>&gt; PAGOS</button></li> 
                            <li><button onClick={() => navCompras(1)}>&gt; SIN FACTURAR</button></li> 
                            <li><button onClick={() => navCompras(2)}>&gt; ORDENES DE COMPRA</button></li> 
                            <li><button onClick={() => navCompras(3)}>&gt; RECEPCIONES</button></li> 
                        </ul>
                    </div>
                    
                </div>
                <div class="card hes">
                    <div class="indicador">
                        <div class="l">
                            <div class="text">PROYECTOS EN DESARROLLO</div>
                            <div class="number">5</div>
                        </div>
                        <div class="r">
                            <div class="text">HOJAS DE RUTA EN CURSO</div>
                            <div class="number">3</div>
                        </div>
                    </div>
                    <div class="titulo">
                        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 4.25V0H0.75C0.334375 0 0 0.334375 0 0.75V15.25C0 15.6656 0.334375 16 0.75 16H11.25C11.6656 16 12 15.6656 12 15.25V5H7.75C7.3375 5 7 4.6625 7 4.25ZM9.03687 11.0003H7V13.5003C7 13.7766 6.77625 14.0003 6.5 14.0003H5.5C5.22375 14.0003 5 13.7766 5 13.5003V11.0003H2.96312C2.51687 11.0003 2.29406 10.46 2.61094 10.1453L5.62406 7.15469C5.83188 6.94812 6.1675 6.94812 6.37531 7.15469L9.38844 10.1453C9.70562 10.46 9.48312 11.0003 9.03687 11.0003ZM11.7812 3.28125L8.72188 0.21875C8.58125 0.078125 8.39063 0 8.19063 0H8V4H12V3.80938C12 3.6125 11.9219 3.42188 11.7812 3.28125Z" fill="white"/>
                            </svg>
                            PARA EMITIR MI HES
                    </div>
                    <div class="menu">
                        <ul>
                            <li><button onClick={() => navHes(0)}>&gt; SUBIR DOCUMENTOS</button></li> 
                            <li><button onClick={() => navHes(1)}>&gt; HOJA DE RUTA</button></li> 
                        </ul>
                    </div>
                </div>
                <div class="card facturas">
                    <div class="indicador">
                        <div class="l">
                            <div class="text">TOTAL FACTURADO</div>
                            <div class="number">$526.470.000</div>
                        </div>
                        <div class="r">
                            <div class="text">PENDIENTE PAGO</div>
                            <div class="number">$345.980.456</div>
                        </div>
                    </div>
                    <div class="titulo">
                        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7812 3.28125L8.72188 0.21875C8.58125 0.078125 8.39063 0 8.19063 0H8V4H12V3.80938C12 3.6125 11.9219 3.42188 11.7812 3.28125ZM7 4.25V0H0.75C0.334375 0 0 0.334375 0 0.75V15.25C0 15.6656 0.334375 16 0.75 16H11.25C11.6656 16 12 15.6656 12 15.25V5H7.75C7.3375 5 7 4.6625 7 4.25ZM2 2.25C2 2.11187 2.11187 2 2.25 2H4.75C4.88813 2 5 2.11187 5 2.25V2.75C5 2.88813 4.88813 3 4.75 3H2.25C2.11187 3 2 2.88813 2 2.75V2.25ZM2 4.75V4.25C2 4.11187 2.11187 4 2.25 4H4.75C4.88813 4 5 4.11187 5 4.25V4.75C5 4.88813 4.88813 5 4.75 5H2.25C2.11187 5 2 4.88813 2 4.75ZM6.5 12.9963V13.75C6.5 13.8881 6.38813 14 6.25 14H5.75C5.61187 14 5.5 13.8881 5.5 13.75V12.9909C5.14719 12.9728 4.80406 12.8497 4.51969 12.6362C4.39781 12.5447 4.39156 12.3622 4.50187 12.2569L4.86906 11.9066C4.95562 11.8241 5.08438 11.8203 5.18563 11.8837C5.30656 11.9594 5.44375 12 5.58625 12H6.46469C6.66781 12 6.83344 11.815 6.83344 11.5878C6.83344 11.4019 6.72062 11.2381 6.55937 11.19L5.15312 10.7681C4.57219 10.5937 4.16625 10.0363 4.16625 9.41219C4.16625 8.64594 4.76156 8.02344 5.49969 8.00375V7.25C5.49969 7.11187 5.61156 7 5.74969 7H6.24969C6.38781 7 6.49969 7.11187 6.49969 7.25V8.00906C6.8525 8.02719 7.19563 8.15 7.48 8.36375C7.60188 8.45531 7.60812 8.63781 7.49781 8.74312L7.13062 9.09344C7.04406 9.17594 6.91531 9.17969 6.81406 9.11625C6.69313 9.04031 6.55594 9 6.41344 9H5.535C5.33187 9 5.16625 9.185 5.16625 9.41219C5.16625 9.59813 5.27906 9.76188 5.44031 9.81L6.84656 10.2319C7.4275 10.4063 7.83344 10.9637 7.83344 11.5878C7.83344 12.3544 7.23813 12.9766 6.5 12.9963Z" fill="white"/>
                            </svg>
                            STATUS DE MIS FACTURAS
                                
                    </div>
                    <div class="menu">
                        <ul>
                            <li><button onClick={() => navFacturas(0)}> &gt; pendiente pago</button></li>
                            <li><button onClick={() => navFacturas(1)}> &gt; facturas actuales</button></li>
                            <li><button onClick={() => navFacturas(2)}> &gt; cuenta corriente</button></li>
                            <li><button onClick={() => navFacturas(3)}> &gt; historia de facturas</button></li>
                            <li><button onClick={() => navFacturas(4)}><div class="btn btn-light">pronto pago</div></button></li>
                        </ul>
                    </div>
                </div>
                <div class="card relacion">
                    <div class="indicador">
                        <div class="l">
                            <div class="text">PRODUCTOS
                                OFRECIDOS</div>
                            <div class="number">26</div>
                        </div>
                        <div class="r">
                            <div class="text">PROMEDIO
                                EVALUACION
                                EBCO</div>
                            <div class="number">75.3%</div>
                        </div>
                    </div>
                    <div class="titulo">
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.80262 0.417433L4.21589 3.52017L0.665805 4.01933C0.0291704 4.10838 -0.225969 4.86532 0.235712 5.29886L2.80412 7.71263L2.19664 11.1224C2.0873 11.7387 2.76038 12.2004 3.32412 11.9121L6.5 10.3021L9.67588 11.9121C10.2396 12.198 10.9127 11.7387 10.8034 11.1224L10.1959 7.71263L12.7643 5.29886C13.226 4.86532 12.9708 4.10838 12.3342 4.01933L8.78411 3.52017L7.19738 0.417433C6.91308 -0.135624 6.08935 -0.142654 5.80262 0.417433Z" fill="white"/>
                            </svg>
                            MI RELACIÓN CON EBCO
                    </div>
                    <div class="menu">
                        <ul>
                            <li><button onClick={() => navRelacionEbco(0)}> &gt; PERFIL </button></li>
                            <li><button onClick={() => navRelacionEbco(1)}> &gt; EVALUACIÓN </button></li>
                            <li><button onClick={() => navRelacionEbco(2)}> &gt; LO QUE OFREZCO </button></li>
                        </ul>
                    </div>
                </div>
            </section>
            <section class="content-banner">
                <div class="banner">
                    Cónocelas aqui
                </div>
                <div class="banner">
                    Decídete
                </div>
            </section>
            <footer class="footer">
                <button class="btn rojo">
                    Preguntas frecuentes
                </button>
                <button class="btn rojo">
                    Procedimientos habituales
                </button>
                <button class="btn rojo">
                    Politicas ebco
                </button>
            </footer>
        </div>
    </div>
  )
}