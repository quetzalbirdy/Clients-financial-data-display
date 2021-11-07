import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faCheck, faClock, faArrowAltCircleRight, faEye, faEdit, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import context from '../constants/Context'


const useStyles = makeStyles({
  table: {
    /* minWidth: 650, */
  },
});

/* 
La tabla basica tiene como props:
titulos: un array con los titulos de cada columna, en caso de usarse una columna con menu o switch, poner esa columna como ''
dataTabla: un array, con arrays que contengan los datos a mostrar en las filas. En caso de que un campo de una fila sean dos valores, uno encima del otro, el valor se puede sustituir por un array con dos valores
menuTitulos: en caso de haber un menu en cada fila, basta con insertar aqui un array con los nombres de cada opcion
menuFunciones: un array con las funciones que se gatillaran en este componente al seleccionar la opcion del menu. Tiene que haber tantas funciones como titulos
estado: en caso de ser una de las filas un estado (con fondo de color), insertar aqui un integer que represente el indice en la fila, en donde se muestra el estado. Por ejemplo si el estado se muestra en la columna 3, el indice sería 2
*/
export default function TablaBasica(props) {
  const classes = useStyles();
  const [estadosSwitch, setEstadosSwitch] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const flagFactoring = (context.flagFactoring === "true")

  useEffect(() => {
    if (!props.paginacion) {
      setRowsPerPage(props.dataTabla.length)
    }
    if (props.switch === true) {
      setSwitch()
    }    
    primeraPagina()
  }, [props.dataTabla])

  const GreenSwitch = withStyles({
    switchBase: {
      color: '#14D2B8',
      '&$checked': {
        color: '#14D2B8',
      },
      '&$checked + $track': {
        backgroundColor: '#14D2B8',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const setSwitch = () => {
    var cantSwitch = [];
    for (var i=0;i<props.dataTabla.length;i++) {
      cantSwitch.push(false)
    }
    setEstadosSwitch(cantSwitch)    
  };
  
  const handleSwitchChange = (index) => {    
    var cantSwitchNueva = [...estadosSwitch];    
    cantSwitchNueva[index] = !cantSwitchNueva[index]
    setEstadosSwitch(estadosSwitch => estadosSwitch = cantSwitchNueva)  
    props.switchCallback(cantSwitchNueva)  
  };

  const primeraPagina = () => {
    setPage(0);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  

  return (
    <div className="content-paginacion">      
      <TableContainer className='tabla-basica' component={Paper}>
        {/* <div className="subtitulo">Subtítulo</div> */}
        <Table stickyHeader className={classes.table} aria-label="simple table">
          { props.titulos &&
          <TableHead>
            <TableRow>
              {props.titulos.map((data, i) => (
                i === 0 ?
                <TableCell key={i}>
                  {data}
                </TableCell> : (
                  (props.esconder === i && !flagFactoring) ? <TableCell class="MuiTableCell-root MuiTableCell-head MuiTableCell-stickyHeader esconder-columna"  key={i} >{data}</TableCell> : <TableCell key={i} >{data}</TableCell>
                )
                
              ))}              
            </TableRow>
          </TableHead>}
          <TableBody>
            {props.dataTabla.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (            
              <TableRow key={index}>
                {/* Columna normal datos */}
                {row.map((data, i) => (
                  i === 0 ?
                  <TableCell key={i} component="th" scope="row">                  
                    {!isNaN(props.boton) && (props.boton === i) ?
                      (<Button key={index} onClick={() => props.botonFunction(page * 10 + index)}>
                        {Array.isArray(data) ? <div key={(i + index).toString()}>{data.map((elem, indexParrafo) => (
                          <p key={(index + i + indexParrafo).toString()}>{elem}</p>
                        ))}</div> : <p>{data}</p>}
                      </Button>) :
                      (Array.isArray(data) ? <div key={(i + index).toString()}>{data.map((elem, indexParrafo) => (
                        <p key={(index + i + indexParrafo).toString()}>{elem}</p>
                      ))}</div> : <p>{data}</p>)
                    }
                  </TableCell> :
                  <TableCell class={(props.esconder === i && !flagFactoring) ? "MuiTableCell-root MuiTableCell-body esconder-columna" : "MuiTableCell-root MuiTableCell-body"}  key={i} >
                    {                  
                    Array.isArray(data) ? 
                    ( (!isNaN(props.estado) && (props.estado === i)) ?
                      <div className='flex'><FontAwesomeIcon className={!isNaN(props.estado) && (props.estado === i) ? ('estado-container estado-'+data[0].toLowerCase()) : ''} icon={data[0].toLowerCase() == 'aprobada' ? faCheck : (data[0].toLowerCase() == 'pendiente' ? faClock : data[0].toLowerCase() == 'rechazada' ? faTimesCircle : faDollarSign)} style={{fontSize: '18px'}} /><FontAwesomeIcon icon={faArrowAltCircleRight} style={{fontSize: '18px'}} /></div> :
                      <div key={(i + index).toString()}>{data.map((elem, indexParrafo) => (
                        <p key={(index + i + indexParrafo).toString()} className={elem == 'PENDIENTE' ? 'texto-rojo' : ''}>{elem}</p>
                      ))}</div> 
                    ) :
                    (
                    (!isNaN(props.boton) && (props.boton === i) ?
                    (<Button key={index} onClick={() => props.botonFunction(page * 10 + index)}>
                      <FontAwesomeIcon className={!isNaN(props.estado) && (props.estado === i) ? ('estado-container estado-'+data.toLowerCase()) : ''} icon={data.toLowerCase() == 'aprobada' ? faCheck : (data.toLowerCase() == 'pendiente' ? faClock : data.toLowerCase() == 'rechazada' ? faTimesCircle : faDollarSign)} style={{fontSize: '18px'}} />
                      <p className={!isNaN(props.estado) && (props.estado === i) ? ('estado-container estado-'+data.toLowerCase()) : ''
                        }>
                        {data}
                      </p>
                    </Button>) :                  
                    (!isNaN(props.estado) && (props.estado === i) ?
                    (data !== "" && data) && (data == 'abierta' ? <p className="estado-abierta estado-container">A</p> : (data.toLowerCase() == 'cerrada' ? <p className="estado-cerrada estado-container">C</p> :<FontAwesomeIcon className={!isNaN(props.estado) && (props.estado === i) ? ('estado-container estado-'+data.toLowerCase()) : ''} icon={data.toLowerCase() == 'aprobada' ? faCheck : (data.toLowerCase() == 'pendiente' ? faClock : data.toLowerCase() == 'rechazada' ? faTimesCircle : faDollarSign)} style={{fontSize: '18px'}} />)) :
                    <p className={!isNaN(props.estado) && (props.estado === i) ? ('estado-container estado-'+data.toLowerCase()) : ''
                      }>
                      {data}
                    </p>))
                    )}
                  </TableCell>
                ))}     
                {/* Botones agregados: ojo, editar, menu */} 
                {(props.menuTitulos) &&
                <TableCell key={index} >
                  <MenuSimple indiceEl={page * 10 + index} menuTitulos={props.menuTitulos} menuFunciones={props.menuFunciones} />
                </TableCell>  }
                {(props.verDetalle) &&
                /* ------------OJO------------ */
                <TableCell key={index} >
                  <Button onClick={() => props.verDetalleFunction(page * 10 + index)}>
                    <FontAwesomeIcon icon={faEye} style={{fontSize: '18px'}} />
                  </Button>
                </TableCell>  }
                {(props.editar) &&
                /* ----------EDITAR---------- */
                <TableCell key={index} >
                  <Button onClick={() => props.editarFunction(page * 10 + index)}>
                    <FontAwesomeIcon icon={faEdit} style={{fontSize: '18px'}} />
                  </Button>
                </TableCell>  }
                {(props.switch && estadosSwitch) &&
                <TableCell key={index} >
                  <GreenSwitch 
                    key={index}
                    checked={estadosSwitch[page * 10 + index]}
                    onChange={() => handleSwitchChange(page * 10 + index)}
                    color="info"
                    name={'switch'+index}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </TableCell>  }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>   
      {props.paginacion && <div className="tabla-basica__paginacion">
        {(props.dataTabla.length > 10) && <p>{`${page+1} / ${((props.dataTabla.length / 10)+1).toString().split(".")[0]}`}</p>}
        <TablePagination
          component="div"
          count={props.dataTabla.length}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}      
        />
      </div>}   
    </div>    
  );
}

function MenuSimple(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {    
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (index) => {
    setAnchorEl(null);    
    if (!isNaN(index)) {
      props.menuFunciones[index](props.indiceEl, index)
    }    
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.menuTitulos.map((titulo, index) => (
          <MenuItem key={index} onClick={()=>handleClose(index)}>{titulo}</MenuItem>
        ))}        
      </Menu>
    </div>
  );
}
