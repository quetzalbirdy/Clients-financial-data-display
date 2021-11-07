let defaultContext = {
    /* MUCHAS RECEPCIONES codigoProveedor: "0010003783", */
    /* codigoProveedor: "0010007680", */
    codigoProveedor: "0010003783",    
    proveedorName: "Proveedor Test",
    contactName: "Contact prueba",
    groupId: "1245",
    userId: "12467",
    companyId: "23464",
    p_auth: "UupWHG4G",
    obras: [{
        "pep": "S-0357-01",
        "name": "4TA AVENIDA CONQUISTA"
    }],
    invokeURL: "http://fuseproxy.vsoft.cl/vs-fuse-service/rest/sap/proveedores",
    fechaDesde: /* 1580526000000 */1483228800000,
    fechaHasta: new Date().getTime(),
    flagFactoring: "false"
}
let LRContext = window.LRContext;
const context = Object.assign(defaultContext, LRContext);

export default context;