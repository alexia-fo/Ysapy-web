import { Sucursal } from "./sucursal.model";
import { Usuario } from "./usuario.model";

export interface RespuestaFiltros{
    usuarios:Usuario[];
    sucursales:Sucursal[];
}

export interface datosCabecera{
    idCabecera:number;
    fechaApertura:Date;
    fechaCierre:Date;
    montoApertura:number;
    montoCierre:number;
    montoDiferencia:number;
    montoPendiente:number;
    //TODO:PROBANDO COBROS POR CREDITOS
    montoOtrosCobros: number;
    idsucursal:number;
    idusuario:number;
    observacion:string;
    estado:string;
    turno:string;
    createdAt:Date;
    updatedAt:Date;
    Usuario:{
        nombre:string
    },
    Sucursal:{
        nombre:string;
    }
}

export interface RespuestaCabecera{
    total:number;
    cabecera:datosCabecera[];
}

//para obtenerCalculoRendicion
export interface DatosDetalleInventario{
    idproducto:number;
    cantidadApertura:number;
    cantidadCierre:number;
    cantidadRecepcion:number;
    cantidadSalida:number;
    precio:number;
    cantidadTotal:number; // para inventarios cerrados
    totalMultiplicado:number; // para inventarios cerrados
    Producto:{
        nombre:String;
    }
}

//para obtenerCalculoRendicion
export interface DatosDetalleRendicion{
    cantidadApertura:number;
    cantidadCierre:number;
    totalApertura:number;
    totalCierre:number;
    montoTotal:number; // para inventarios cerrados
    Dinero:{
        nombreBillete:string;
        monto:number;
    }
}


//FIXME:para obtener todos los datos de una vez (mostrar las tablas en modales)
export interface RespuestaCalculosRendicion{
    detalleInventario:DatosDetalleInventario[];
    detalleRendicion:DatosDetalleRendicion[];
    totalVenta:number;
    totalAperturaDinero:number;
    totalCierreDinero:number;
    totalDiferenciaDinero:number;
    totalPendiente:number;
    diferenciaVentaCaja:number;
    descVentaCaja:string;
}

export interface RespuestaCalculos{
    totalVenta:number;
    totalAperturaDinero:number;
    totalCierreDinero:number;
    totalDiferenciaDinero:number;
    totalPendiente:number;
    //TODO:PROBANDO COBROS POR CREDITOS
    totalOtrosCobros:number;
    diferenciaVentaCaja:number;
    descVentaCaja:string;
}

//FIXME:para obtener todos los datos de por separado (mostrar las tablas en paginas)

export interface RespuestaDetalleInventario{
    detalleInventario:DatosDetalleInventario[];
}

export interface RespuestaDetalleRendicion{
    detalleRendicion:DatosDetalleRendicion[];
}
//FIXME:





export interface DatosDetRecepcion{
    idcrecepcion: number;
    idproducto:number;
    cantidad:number;
    total:number;
    Crecepcion:{
        idRecepcion: number;
        fecha: Date;
        observacion: string;
        idusuario: number;
        nroComprobante: number;
        estado: boolean;
        idSucursal:number;
        idcabinventario: number;
        createdAt: Date;
        updatedAt: Date;
        Usuario:{
            nombre:string;
        }
    },
    Producto:{
        nombre:string;
    },

}

export interface RespuestaDetRecepcion{
    dRecepcion:DatosDetRecepcion[];
}

export interface DatosDetSalida{
    idcsalida: number,
    idproducto: number,
    idsalida: number,
    cantidad: number,
    total: number,
    Csalida: {
        idCabecera: number;
        idcabinventario:number;
        fecha:Date;
        observacion:string;
        idusuario:number;
        idsucursal:number;
        createdAt:Date;
        updatedAt:Date;
        Usuario:{
            nombre:string;
        }
    },
    Salida:{
        descripcion:string;
    },
    Producto:{
        nombre:string;
    }
}

export interface RespuestaDetSalida{
    dSalida:DatosDetSalida[];
}


////////////////para ver inventarios no cerrados
export interface ProductoInventario{
    idproducto:number;
    cantidadApertura:number;
    cantidadCierre:number;
    cantidadRecepcion:number;
    cantidadSalida:number;
    precio:number;
    Producto:{
        nombre:String;
    }
}

export interface DineroRendicion{
    cantidadApertura:number;
    cantidadCierre:number | null;
    totalApertura:number;
    totalCierre:number | null;
    Dinero:{
        nombreBillete:string;
    }
}

export interface RespuestaRendicion{
    detalleInventario:ProductoInventario[];
    detalleRendicion:DineroRendicion[];
}


//////filtro de cabeceras

export interface DatosFiltro{
    desde:Date;
    hasta:Date;
    estado:string;
    sucursal:number | 'todos';
    turno:string;
}