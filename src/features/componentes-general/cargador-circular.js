import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 105px)',
    color: '#ff3f32',
    border: 'red solid 2px',
    width:'100%',
    background:'rgba(255,0,0,0.3)',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const useStylesModal = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 205px)',
    color: '#ff3f32',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function CargandoCircular() {
  const classes = useStyles();

  return (
    <div className='loading'>
      <CircularProgress color="red" />      
    </div>
  );
}

function CargandoCircularModal() {
  const classes = useStylesModal();

  return (
    <div className={classes.root}>
      <CircularProgress color="red" />      
    </div>
  );
}

export {CargandoCircular, CargandoCircularModal}
