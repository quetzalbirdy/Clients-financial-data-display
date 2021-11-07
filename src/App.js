import React from 'react';
import {  
  Switch,
  Route,  
  useHistory
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './features/home/home'
import PendientePago from './features/mis-facturas/pendiente-pago';
import FacturasActuales from './features/mis-facturas/facturas-actuales';
import ProntoPago from './features/mis-facturas/pronto-pago';
import HistoriaFacturas from './features/mis-facturas/historia-facturas';
import CuentaCorriente from './features/mis-facturas/cuenta-corriente';
import SubirDocumentos from './features/doc-apoyo-hes/subir-documentos';
import SinFacturar from './features/compras/sin-facturar';
import OrdenesCompra from './features/compras/ordenes-compra';
import Recepciones from './features/compras/recepciones';
import LoQueOfrezco from './features/relacion-ebco/lo-que-ofrezco';
import FacturasCedidas from './features/mis-facturas/facturas-cedidas';
import HojaRuta from './features/doc-apoyo-hes/hoja-ruta';
import Pagos from './features/compras/pagos';
import OrdenDeCompra from './features/componentes-general/orden-compra';
import Context from './features/constants/Context';
import EntregasEnProceso from './features/compras/entregas-en-proceso';

export default function App() {
  console.log(Context);
  return (
    <Switch>
      <Route exact path="/" component={Home} />       
      <Route exact path="/pendiente-pago" component={PendientePago} />  
      <Route exact path="/facturas-actuales" component={FacturasActuales} />   
      <Route exact path="/pronto-pago" component={ProntoPago} />        
      <Route exact path="/facturas-cedidas" component={FacturasCedidas} />  
      <Route exact path="/cuenta-corriente" component={CuentaCorriente} />           
      <Route exact path="/historia-de-facturas" component={HistoriaFacturas} /> 
      <Route exact path="/subir-documentos" component={SubirDocumentos} />   
      <Route exact path="/sin-facturar" component={SinFacturar} />  
      <Route exact path="/entregas-en-proceso" component={EntregasEnProceso} />      
      <Route exact path="/ordenes-compra" component={OrdenesCompra} />        
      <Route exact path="/recepciones" component={Recepciones} /> 
      <Route exact path="/lo-que-ofrezco" component={LoQueOfrezco} />
      <Route exact path="/hoja-de-ruta" component={HojaRuta} />    
      <Route exact path="/pagos" component={Pagos} />  
      <Route exact path="/orden-de-compra" component={OrdenDeCompra} />        
    </Switch>
  )
}
