import React, { useState, useEffect } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import {serviciosFacturas} from '../../api/servicios'
import {CargandoCircular} from '../componentes-general/cargador-circular'

export default function ProntoPago() {
  const [modalOpen, setModalOpen] = useState(false)
  const [dataResponse, setDataResponse] = useState('');
  const [totalPendientePago, setTotalPendientePago] = useState('');
  const [filas, setFilas] = useState('')
  const [numerosOC, setNumerosOC] = useState('')
  const [totalFinanciar, setTotalFinanciar] = useState(0);
  const [filasModal, setfilasModal] = useState('');

  useEffect(() => {
    obtenerFacturas() 
  }, []);

  var servicios = new serviciosFacturas();  
  const obtenerFacturas =  async () => {    
    await servicios.getFacturaList().then((res) => {
      const resOrdenado = res.sort((a, b) => b.fechaEmision-a.fechaEmision)
      setDataResponse(resOrdenado)
      var filasLocal = [];
      var numerosOCLocal = [];
      let totalPendientePagoLocal = 0;
      for (var i = 0; i < resOrdenado.length; i++) {
        var factura = resOrdenado[i]
        if (factura.estado === "5") {
          totalPendientePagoLocal += parseFloat(factura.monto)
          var fila = [[factura.numero, factura.fechaEmisionAsString], factura.numero, factura.montoAsString, factura.fechaEmisionAsString, factura.fechaVencimientoAsString, factura.fechaEstimadaPagoAsString, factura.pepObra]
          filasLocal.push(fila)
          numerosOCLocal.push(factura.numeroOC)
        }
      }    
      setTotalPendientePago(totalPendientePagoLocal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))
      setFilas(filasLocal)      
      setNumerosOC(numerosOCLocal)
    });
  } 
  
  const titulos = ['N°/Fecha','Factura','Monto','Emisión','Vencimiento','Estimado pago','Obra', 'Financiar',]; 

  const titulosModal = ['Factura', 'Monto', 'Emisión' ,'Vencimiento', 'Estimado Pago','Medio pago', 'Estado'];       

  const abrirModal = () => {
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const obtenerSwitchEstados = (estadosSwitch) => {     
    let totalFinanciarLocal = 0
    let filasModalLocal = []
    for (var i = 0; estadosSwitch.length > i; i++) {
      console.log(estadosSwitch[i])
      if (estadosSwitch[i]) {
        totalFinanciarLocal += dataResponse[i].monto
        let factura = dataResponse[i]
        let fila = [factura.numero, factura.montoAsString, factura.fechaEmisionAsString, factura.fechaVencimientoAsString, factura.fechaEstimadaPagoAsString, factura.medioPago, factura.estado]
        filasModalLocal.push(fila)
      }
    }  
    setfilasModal(filasModalLocal)  
    setTotalFinanciar(totalFinanciarLocal)    
  }

  return(
    <div className="fondo-app factura pronto-pago con-bottom-bar flex flex-column">
      <AppBar />        
      <div className="contenido-ventana">
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Facturas financiables</h2>
          {/* <div className="titulo-tabla__botones flex flex-row">
            <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faSortAmountUp} style={{fontSize: '18px'}} />
              <p>Ordenar</p>
            </Button> 
            <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faFilter} style={{fontSize: '18px'}} />
              <p>Filtrar</p>
            </Button>                        
          </div> */}
        </div>            
        {filas ? <div>
          <TablaBasica paginacion={true} titulos={titulos} dataTabla={filas} switch={true} switchCallback={obtenerSwitchEstados} />
          <div className="flex flex-row justify-center align-center total-financiar">
            <div className="valor-total">
              <p class="text">Total a financiar</p>
              <p className="valor-total__valor">{`$${totalFinanciar.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`}</p>
            </div>
          </div>
        </div> : <CargandoCircular />}
        <div className="boton-accion-centro flex justify-center align-center">
          <Button variant="contained" 
            onClick={abrirModal}
          >Pronto pago</Button>
          <Modal
            open={modalOpen}
            onClose={cerrarModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div className="modal-basico pronto-pago-modal flex flex-column">
              <Button className="modal-basico__cerrar" onClick={cerrarModal}>
                <CloseIcon />
              </Button>
              <div className="pronto-pago-modal__contenido">
                <TablaBasica titulos={titulosModal} dataTabla={filasModal} />
                <ValorTotal texto={'Total a financiar'} valorTotal={totalFinanciar.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} />
                <div className="condiciones-financiamiento flex flex-row">                  
                  <div className="flex flex-column">
                    <p>1.7%</p>
                    <p>Tasa</p>
                  </div>
                  {/* <div className="flex flex-column">
                    <p>$7.345.765</p>
                    <p>Costo de operación</p>
                  </div> */}
                </div>
                <div className="monto-inmediato flex flex-column">
                  <p>$640.000.000</p>
                  <p>Monto inmediato</p>
                </div>
                <div className="pronto-pago-modal__boton">
                  <div className="boton-accion-centro flex justify-center align-center">
                    <Button variant="contained">Solicitar financiamiento</Button>                  
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <BottomBar />
    </div>        
  )
}