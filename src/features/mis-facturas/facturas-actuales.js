import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,  
  useHistory
} from "react-router-dom";
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faDollarSign, faCheck, faFaClock, faArrowAltCircleRight, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import {serviciosFacturas} from '../../api/servicios'
import Modal from '@material-ui/core/Modal';
import ModalBasico from '../componentes-general/modals/modal-basico'
import {CargandoCircular} from '../componentes-general/cargador-circular'
import BotonFiltrar from '../componentes-general/boton-filtrar';

export default function FacturasActuales() {
  const [modalOpen, setModalOpen] = useState(false)
  const [indexModal, setIndexModal] = useState(0)
  const [filas, setFilas] = useState('')
  const [numeroFactura, setNumeroFactura] = useState('')
  const [numerosOC, setNumerosOC] = useState('')
  const [dataResponse, setDataResponse] = useState('');
  const [dataDetalle, setDataDetalle] = useState('');  
  let history = useHistory();

  useEffect(() => {
    obtenerFacturas() 
  }, []);

  const abrirModal = (indexFila, indexBoton, numeroFactura) => {
    setDataDetalle(dataResponse[indexFila])
    setNumeroFactura(numeroFactura)
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

  const generarEstado = (estadoNumero, cedida) => {    
    switch (estadoNumero.toString()) {              
      case "1":
      case "3":
      case "7":
      case "8":            
        return cedida.toString() === "1" ? ['Pendiente', 'cedida'] : 'Pendiente'        
      case "5":     
        return cedida.toString() === "1" ? ['Aprobada', 'cedida'] : 'Aprobada'
      case "F":                               
        return ['Aprobada', 'cedida']
      case "6":
      case "N":            
        return cedida.toString() === "1" ? ['Rechazada', 'cedida'] : 'Rechazada' 
      case "":
        return 'Pagada'   
      case "C":
        return 'Pagada'   
    }
  }

  var servicios = new serviciosFacturas();  
  const obtenerFacturas =  async () => {    
    await servicios.getFacturaList().then((res) => {      
      setDataResponse(res)
      var filasLocal = [];
      var numerosOCLocal = [];
      for (var i = 0; i < res.length; i++) {
        var factura = res[i]
        var fila = [[factura.numero, factura.fechaEmisionAsString], factura.numero, factura.montoAsString, factura.fechaEmisionAsString, factura.fechaVencimientoAsString, factura.fechaEstimadaPagoAsString, factura.pepObra, factura.medioPago, generarEstado(factura.estado, factura.cedida)]
        filasLocal.push(fila)
        numerosOCLocal.push(factura.numeroOC)
      }      
      setFilas(filasLocal)      
      setNumerosOC(numerosOCLocal)
    });
  }  
  
  const titulos = ['N°/Fecha','Factura','Monto', 'Emision','Vencimiento','Estimado pago','Obra','Medio de pago','Estado', ''];
  const menuTitulos = ['Detalle','Bitácora','Orden de Compra']
  const menuFunciones = [
    function(indexFila, indexBoton) {abrirModal(indexFila, indexBoton, filas[indexFila][1])},
    function(indexFila, indexBoton) {abrirModal(indexFila, indexBoton, filas[indexFila][1])},    
    function(indexFila, indexBoton) {console.log(numerosOC[indexFila]);history.push({
      pathname: "/orden-de-compra",
      state: {
        numeroOC: numerosOC[indexFila],
        obra: filas[indexFila][6]
      }
    })},
    function(indexFila, indexBoton) {console.log(numerosOC[indexFila])},    
  ];

   return(
    <div className="fondo-app factura facturas-actuales con-bottom-bar flex flex-column">
      {dataDetalle !== '' && <Modal
        open={modalOpen}
        onClose={cerrarModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalBasico numFactura={numeroFactura} cantMenu={2} cerrarModal={cerrarModal} index={indexModal} modificarIndex={cambiarIndexModal} detalleFactura={dataDetalle} />
      </Modal>}
      <AppBar />        
      { filas ?
        <div className="contenido-ventana">
          <div className="titulo-tabla flex flex-row align-center">
            <h2>Facturas Actuales</h2>
            <div className="titulo-tabla__botones flex flex-row">
              <BotonFiltrar />                      
            </div>
          </div>            
          <TablaBasica titulos={titulos} dataTabla={filas} menuTitulos={menuTitulos} menuFunciones={menuFunciones} estado={8} />
          <div className="facturas-actuales__simbolos flex flex-row justify-center align-center">
            <div className="facturas-actuales__simbolos__simbolo flex flex-column align-center justify-center">
              <FontAwesomeIcon icon={faDollarSign} style={{fontSize: '18px'}} />
              <p>Pagada</p>
            </div>
            <div className="facturas-actuales__simbolos__simbolo flex flex-column align-center justify-center">
              <FontAwesomeIcon icon={faClock} style={{fontSize: '18px'}} /> 
              <p>Pendiente</p>
            </div>
            <div className="facturas-actuales__simbolos__simbolo flex flex-column align-center justify-center">
              <FontAwesomeIcon icon={faCheck} style={{fontSize: '18px'}} />
              <p>Aprobada</p>
            </div>
            <div className="facturas-actuales__simbolos__simbolo flex flex-column align-center justify-center">
              <FontAwesomeIcon icon={faTimesCircle} style={{fontSize: '18px'}} />
              <p>Rechazada</p>
            </div>
            <div className="facturas-actuales__simbolos__simbolo flex flex-column align-center justify-center">
              <FontAwesomeIcon icon={faArrowAltCircleRight} style={{fontSize: '18px'}} />
              <p>Cedida</p>
            </div> 
            <div className="historia-facturas__simbolos__simbolo flex flex-column align-center justify-center">
              <svg width="43" height="30" viewBox="0 0 43 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 7C5.14718 7 0 12.1472 0 18.5C0 24.8528 5.14718 30 11.5 30C17.8528 30 23 24.8528 23 18.5C23 12.1472 17.8528 7 11.5 7ZM14.1478 23.2345L10.0579 20.2621C9.91411 20.1554 9.83065 19.9885 9.83065 19.8123V12.0081C9.83065 11.702 10.081 11.4516 10.3871 11.4516H12.6129C12.919 11.4516 13.1694 11.702 13.1694 12.0081V18.3933L16.1139 20.5357C16.3643 20.7165 16.4153 21.0643 16.2345 21.3147L14.9268 23.1139C14.746 23.3597 14.3982 23.4153 14.1478 23.2345Z" fill="#F8C71C"/>
              <rect x="15" width="28" height="14" rx="5" fill="#FF0000"/>
              <path d="M22.1319 8.28095L22.1949 8.39795C22.2399 8.47895 22.2939 8.56895 22.3479 8.66795C22.4019 8.76695 22.4559 8.86595 22.5099 8.95595C22.5639 9.04595 22.5909 9.10895 22.5999 9.13595L23.1129 9.99995H25.1649L23.1489 6.80495L25.1019 3.69995H23.0319L22.4469 4.75295C22.4289 4.78895 22.4019 4.84295 22.3659 4.91495C22.3299 4.98695 22.2939 5.05895 22.2579 5.13095C22.2219 5.20295 22.1859 5.26595 22.1589 5.31995L22.1139 5.40095H22.1049L22.0599 5.32895C22.0329 5.27495 21.9969 5.21195 21.9609 5.13995C21.9249 5.06795 21.8889 4.99595 21.8529 4.92395C21.8169 4.85195 21.7899 4.79795 21.7629 4.76195L21.1869 3.70895H19.1079L21.0699 6.81395L19.0449 9.99995H21.0969L21.6099 9.14495C21.6279 9.11795 21.6639 9.06395 21.7179 8.97395C21.7719 8.88395 21.8259 8.78495 21.8799 8.68595C21.9339 8.58695 21.9789 8.49695 22.0329 8.41595L22.1229 8.28095H22.1319Z" fill="white"/>
              <path d="M31.2207 3.69995L30.1497 5.40095C30.0417 5.57195 29.9517 5.71595 29.8797 5.82395C29.8077 5.93195 29.7537 6.02195 29.7177 6.08495L29.6457 6.21095L29.6277 6.24695H29.6187L29.5917 6.21995C29.5737 6.20195 29.5467 6.15695 29.5107 6.09395C29.4747 6.03095 29.4207 5.94995 29.3577 5.84195C29.2947 5.73395 29.2047 5.58995 29.0967 5.41895L28.0257 3.71795H26.4057V10.009H28.0977V8.83895C28.0977 8.43395 28.0977 8.09195 28.0887 7.80395C28.0797 7.51595 28.0707 7.28195 28.0617 7.10195C28.0527 6.92195 28.0527 6.79595 28.0437 6.71495L28.0347 6.59795H28.0437L28.1337 6.75095C28.1967 6.84995 28.2597 6.95795 28.3317 7.07495C28.4037 7.19195 28.4667 7.29995 28.5297 7.39895L28.6197 7.55195L29.1507 8.45195H30.0417L30.5817 7.55195L30.6627 7.39895C30.7167 7.29995 30.7797 7.19195 30.8517 7.07495C30.9237 6.95795 30.9867 6.84995 31.0497 6.75095L31.1397 6.60695H31.1487L31.1397 6.72395C31.1307 6.80495 31.1307 6.93095 31.1217 7.11095C31.1127 7.29095 31.1037 7.52495 31.0947 7.81295C31.0857 8.10095 31.0857 8.45195 31.0857 8.85695V10.027H32.7777L32.8407 3.69995H31.2207Z" fill="white"/>
              <path d="M36.4037 8.38895V3.69995H34.6757V9.99995H39.2657V8.38895H36.4037Z" fill="white"/>
            </svg>
              <p>XML</p>
            </div>            
          </div>
          {/* <div className="boton-accion-centro flex justify-center align-center">
            <Button onClick={obtenerFacturas} variant="contained">Mi cuenta corriente</Button>
          </div> */}
        </div> : <CargandoCircular />}
      <BottomBar />
    </div>        
  )
}