import React, { useState, useEffect } from 'react';
import TablaBasica from '../../componentes-general/tabla-basica';
import {CargandoCircularModal} from '../../componentes-general/cargador-circular'
import {serviciosFacturas} from '../../../api/servicios'

export default function Bitacora({numeroFactura}) {
  const [filasBitacora, setFilasBitacora] = useState('')
  const [filas, setFilas] = useState('')

  useEffect(() => {
    obtenerBitacora(numeroFactura) 
  }, []);

  var servicios = new serviciosFacturas();  

  const obtenerBitacora =  async (numeroFactura) => {          
    await servicios.getBitacoraDetalle(numeroFactura).then((res) => {                           
      var bitacoras = res.payload
      var filasBitacoraLocal = []                        
      var fila = [
        [[numeroFactura, 'Factura'],['$325.548.248', 'Monto'],],
        [['01/01/21', 'Emisión'], ['01/02/21', 'Fecha pago']],
      ] 
      setFilas(fila)    
      for (var i= 0; i < bitacoras.length; i++) {
        var bitacora = bitacoras[i]
        var filaBitacora = [bitacora.fechaAsString, bitacora.accion, bitacora.responsable]
        filasBitacoraLocal.push(filaBitacora)
      }      
      setFilasBitacora(filasBitacoraLocal)
    });
  }
      
    const titulos = ['Fecha', 'Acción', 'Responsable'];
        
  
    return(
      <div>
        {filas && filasBitacora ? 
        <div className="datos-modal bitacora">      
          <TablaBasica dataTabla={filas} />      
          <div className="medio-pago">
            <p>Edificio 4ta Avenida Conquista</p>
            <p>Obra</p>
          </div>   
          <TablaBasica titulos={titulos} dataTabla={filasBitacora} />  
        </div> : <CargandoCircularModal />}
      </div>
    )
  }