import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TablaBasica from '../../componentes-general/tabla-basica';

export default function Fimax(props) {  

    const filas1 = [
      [['01/10/20', 'Emision'], ['01/03/21', 'Pagada'], ['01/02/21', 'Estimado pago']],        
    ];
    const filas2 = [
      [['76', 'Días de financiamiento'], ['1.7%', 'Tasa'], ['$7.345.675', 'Costo de operación']],        
    ];
    const titulos = ['Tipo', 'N°', 'Fecha', 'Estado'];
    const menuTitulos = ['Detalle','Bitácora','Fimax','Orden de Compra','Recepción']
    const menuFunciones = [
      function() {console.log('funciona1')},
      function() {console.log('funciona2')},
      function() {console.log('funciona3')},
      function() {console.log('funciona4')},
      function() {console.log('funciona5')}
    ];          
  
    return(
      <div className="datos-modal fimax">      
        <TablaBasica dataTabla={filas1} />   
        <div className="monto-factura flex flex-column justify-center align-center">
          <p>Monto Factura</p>
          <p>$325.548.248</p>
        </div>   
        <TablaBasica dataTabla={filas2} />   
        <div className="monto-inmediato flex flex-column justify-center align-center">        
          <p>$325.000.000</p>
          <p>Monto inmediato</p>
        </div> 
        <div className="boton-accion-centro flex justify-center align-center">
          <Button variant="contained">Solicitar financiamiento</Button>
        </div>         
      </div>
    )
  }