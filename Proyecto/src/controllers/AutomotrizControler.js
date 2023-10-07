const { response } = require("express");
const session = require('express-session');

const controller = {};

// CONTROLADOR VEHICULO ADMIN
controller.listVehiculeadmin = (req, res) => {
    const userId = req.session.userId;
    console.log(userId);
    req.getConnection((err, conn) =>{
        conn.query(`SELECT
        vh.pk_vehiculo AS pk_vehiculo,
        mc.descripcion AS marca,
        tv.descripcion AS tipo_vehiculo,
        vh.modelo AS modelo,
        vh.placa AS placa,
        vh.color AS color,
        vh.kilometraje AS kilometraje,
        cl.nombre AS cliente
      FROM
        Vehiculo vh
      INNER JOIN
        marca mc ON mc.pk_marca = vh.fk_marca
      INNER JOIN
        cliente cl ON cl.pk_cliente = vh.fk_cliente
      INNER JOIN
        tipo_vehiculo tv ON tv.pk_tipo = vh.fk_tipo;
        ` , (err, vehiculos) => {
            if (err) {
                res.json(err)
            }
            console.log(vehiculos)
            res.render('vehiculosadmin' , {  //renderiza en archivo vista vehiculos
                data: vehiculos 
            })
        })
    })
}

controller.saveVehiculeadmin = (req, res) => {
    const userId = req.session.userId;
    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`insert into vehiculo(fk_marca, fk_tipo, modelo, placa, color, kilometraje, fk_cliente) values ('${data.marca}','${data.tipo}','${data.modelo}','${data.placa}','${data.color}','${data.kilometraje}',${data.cliente})`, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            /*res.render('./crear/crear_vehiculos.ejs')*/
            res.redirect('/vehiculosadmin')
        })
    })
}

controller.editVehiculeadmin = async (req, res) => {

    req.getConnection((err, conn) =>{
        conn.query(`select * from vehiculo where pk_vehiculo = ${pk_vehiculo}`, (err, vehiculos) =>{
            res.render("./editar/editar_vehiculos" , {
            data: vehiculos[0]})
        })
    })
   
}

controller.updateVehiculoadmin = (req, res) => {

    const {pk_vehiculo} = req.params
    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`update vehiculo set fk_marca = '${data.marca}' , fk_tipo = '${data.tipo}' , modelo = '${data.modelo}' , placa = '${data.placa}' , color = '${data.color}' , kilometraje = '${data.kilometraje}' , fk_cliente = ${data.cliente} where pk_vehiculo = ${pk_vehiculo} `, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            res.redirect('/vehiculosadmin')
        })
    })
}

controller.deleteVehiculoadmin = (req, res) => {

    const {pk_vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from vehiculo where pk_vehiculo = ${pk_vehiculo}`, (err, vehiculos) =>{
            res.redirect("/vehiculosadmin")
        })
    })
}


//CONTROLADOR VEHICULO usuario

controller.listVehicule = (req, res) => {
    const userId = req.session.userId;
    console.log(userId);
    req.getConnection((err, conn) =>{
        conn.query(`SELECT
        vh.pk_vehiculo AS pk_vehiculo,
        mc.descripcion AS marca,
        tv.descripcion AS tipo_vehiculo,
        vh.modelo AS modelo,
        vh.placa AS placa,
        vh.color AS color,
        vh.kilometraje AS kilometraje,
        cl.nombre AS cliente
      FROM
        Vehiculo vh
      INNER JOIN
        marca mc ON mc.pk_marca = vh.fk_marca
      INNER JOIN
        cliente cl ON cl.pk_cliente = vh.fk_cliente
      INNER JOIN
        tipo_vehiculo tv ON tv.pk_tipo = vh.fk_tipo
        WHERE vh.fk_cliente = ${userId};
        ` , (err, vehiculos) => {
            if (err) {
                res.json(err)
            }
            console.log(vehiculos)
            res.render('vehiculos' , {  //renderiza en archivo vista vehiculos
                data: vehiculos 
            })
        })
    })
}

controller.saveVehicule = (req, res) => {
    const userId = req.session.userId;
    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`insert into vehiculo(fk_marca, fk_tipo, modelo, placa, color, kilometraje, fk_cliente) values ('${data.marca}','${data.tipo}','${data.modelo}','${data.placa}','${data.color}','${data.kilometraje}',${userId})`, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            /*res.render('./crear/crear_vehiculos.ejs')*/
            res.redirect('/vehiculo')
        })
    })
}

controller.editVehicule = async (req, res) => {
    const {pk_vehiculo} = req.params

    const qmarca = await consultarMarca(req) 

    const qtipo = await consultarTipo (req)

    const qcliente = await consultarCliente (req)

    const vehiculos = await consultarVehiculo(req, pk_vehiculo);

    res.render("./editar/editar_vehiculos", {
        data: vehiculos[0],
        qmarca,
        qtipo,
        qcliente
    });

    async function consultarVehiculo(req, pk_vehiculo) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `SELECT * FROM vehiculo WHERE pk_vehiculo = ${pk_vehiculo}`,
                    (err, vehiculos) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(vehiculos);
                        }
                    }
                );
            });
        });
    }
    async function consultarMarca(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query('SELECT * FROM marca', (err, marcas) => {
                            resolve(marcas);
                    });    
            });
        });
    }
    // Función para consultar los tipos de vehículo
    async function consultarTipo(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM tipo_vehiculo', (err, tipoV) => {       
                        resolve(tipoV);
                });
            });
        })
    }
    async function consultarCliente(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT pk_cliente, nombre FROM cliente', (err, cliente) => {       
                        resolve(cliente);
                });
             });
        })
    }
    /*req.getConnection((err, conn) =>{
        conn.query(`select * from vehiculo where pk_vehiculo = ${pk_vehiculo}`, (err, vehiculos) =>{
            res.render("./editar/editar_vehiculos" , {
            data: vehiculos[0] })
        })
    })*/
}

controller.updateVehiculo = (req, res) => {

    const {pk_vehiculo} = req.params
    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`update vehiculo set fk_marca = '${data.marca}' , fk_tipo = '${data.tipo}' , modelo = '${data.modelo}' , placa = '${data.placa}' , color = '${data.color}' , kilometraje = '${data.kilometraje}' , fk_cliente = ${data.cliente} where pk_vehiculo = ${pk_vehiculo} `, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            res.redirect('/vehiculo')
        })
    })
}

controller.deleteVehiculo = (req, res) => {

    const {pk_vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from vehiculo where pk_vehiculo = ${pk_vehiculo}`, (err, vehiculos) =>{
            res.redirect("/vehiculo")
        })
    })
}

//CONTROLADORES DE MARCA

controller.listMarca = (req, res) => {    //linea siempre, solo crearle nomre metodo
    req.getConnection((err, conn) =>{  //tambien igual
        conn.query('SELECT * FROM marca' , (err, marca) => {  //cambiar select de las tablas y crear el parametro
            if (err) {
                res.json(err)
            }
            console.log(marca)
            res.render('marca' , {  //renderiza en archivo vista vehiculos
                data: marca 
            })
        })
    })
}


controller.saveMarca = (req, res) => {

    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`insert into marca(descripcion) values ('${data.desc}')`, (err, marca) => { //vehiculos hace referencia al resultado del query
            console.log(marca)
            res.redirect('/marca')
        })
    })
}

controller.editMarca = (req, res) => {
    const {pk_marca} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from marca where pk_marca = ${pk_marca}`, (err, marca) =>{
            res.render("./editar/editar_marca" , {
            data: marca[0] })
        })
    })
}

controller.updateMarca = (req, res) => {

    const {pk_marca} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update marca set descripcion = '${data.desc}' where pk_marca=${pk_marca} `, (err, marca) => { //vehiculos hace referencia al resultado del query
            res.redirect('/marca')
        })
    })
}

controller.deleteMarca = (req, res) => {

    const {pk_marca} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from marca where pk_marca = ${pk_marca}`, (err, vehiculos) =>{
            res.redirect("/marca")
        })
    })
}

//CONTROLADOR TIPO VEHICULO

controller.listTipoV = (req, res) => {
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM tipo_vehiculo' , (err, tipoV) => {
            if (err) {
                res.json(err)
            }
            res.render('tipo_vehiculo' , {  //renderiza en archivo vista tipo
                data: tipoV
            })
        })
    })
}

controller.saveTipoV = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into tipo_vehiculo(descripcion) values ('${data.desc}')`, (err, tipoV) => { //tipoV hace referencia al resultado del query
            res.redirect('/tipoV')
        })
    })
}

controller.editTipoV = (req, res) => {
    const {pk_tipo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from tipo_vehiculo where pk_tipo = ${pk_tipo}`, (err, tipo) =>{
            res.render("./editar/editar_tipoV" , {
            data: tipo[0] })
        })
    })
}

controller.updateTipoV = (req, res) => {

    const {pk_tipo} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update tipo_vehiculo set descripcion = '${data.desc}' where pk_tipo=${pk_tipo} `, (err, tipoV) => { //vehiculos hace referencia al resultado del query
            res.redirect('/tipoV')
        })
    })
}

controller.deleteTipoV = (req, res) => {

    const {pk_tipo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from tipo_vehiculo where pk_tipo = ${pk_tipo}`, (err, tipoV) =>{
            res.redirect("/tipoV")
        })
    })
}

//RUTA CLIENTE

controller.listCliente = (req, res) => {
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM cliente' , (err, cliente) => {
            if (err) {
                res.json(err)
            }
            res.render('cliente' , {  //renderiza en archivo vista tipo
                data: cliente
            })
        })
    })
}

controller.saveCliente = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into cliente(nombre, correo, dpi, numero, direccion_cliente) VALUES ('${data.nombre}','${data.correo}','${data.dpi}', ${data.numero},'${data.direccion_cliente}');`, (err, cliente) => { //tipoV hace referencia al resultado del query
            res.redirect('/cliente')
        })
    })
}

controller.editCliente = (req, res) => {
    const {pk_cliente} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from cliente where pk_cliente = ${pk_cliente}`, (err, tipo) =>{
            res.render("./editar/editar_cliente" , {
            data: tipo[0] })
        })
    })
}

controller.updateCliente = (req, res) => {

    const {pk_cliente} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update cliente set nombre = '${data.nombre}', correo = '${data.correo}', dpi = '${data.dpi}', numero = ${data.numero}, direccion_cliente = '${data.direccion_cliente}'  where pk_cliente=${pk_cliente} `, (err, tipoV) => { //vehiculos hace referencia al resultado del query
            res.redirect('/cliente')
        })
    })
}

controller.deleteCliente = (req, res) => {

    const {pk_cliente} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from cliente where pk_cliente = ${pk_cliente}`, (err, tipoV) =>{
            res.redirect("/cliente")
        })
    })
}

//EMPLEADOS 
controller.listEmpleado = (req, res) => {    //linea siempre, solo crearle nomre metodo
    req.getConnection((err, conn) =>{  //tambien igual

        conn.query('SELECT * FROM empleado' , (err, empleado) => {  //cambiar select de las tablas y crear el parametro
            if (err) {
                res.json(err)
            }
            console.log(empleado)
            res.render('empleado' , {  //renderiza en archivo vista vehiculos
                data: empleado 
            })
        })
    })
}
controller.saveEmpleado = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into empleado(nombre, correo, dpi, numero, direccion_Empleado) VALUES ('${data.nombre}','${data.correo}','${data.dpi}', ${data.numero},'${data.direccion_Empleado}');`, (err, cliente) => { //tipoV hace referencia al resultado del query
            res.redirect('/empleado')
        })
    })
}

controller.editEmpleado = (req, res) => {
    const {pk_empleado} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from empleado where pk_empleado = ${pk_empleado}`, (err, tipo) =>{
            res.render("./editar/editar_empleado" , {
            data: tipo[0] })
        })
    })
}

controller.updateEmpleado = (req, res) => {

    const {pk_empleado} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update empleado set nombre = '${data.nombre}', correo = '${data.correo}', dpi = '${data.dpi}', numero = ${data.numero}, direccion_Empleado = '${data.direccion_Empleado}'  where pk_empleado=${pk_empleado} `, (err, tipoV) => { //vehiculos hace referencia al resultado del query
            res.redirect('/empleado')
        })
    })
}

controller.deleteEmpleado = (req, res) => {

    const {pk_empleado} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from empleado where pk_empleado = ${pk_empleado}`, (err, tipoV) =>{
            res.redirect("/empleado")
        })
    })
}

//SERVICIOS
controller.listServicio = (req, res) => {    //linea siempre, solo crearle nomre metodo
    req.getConnection((err, conn) =>{  //tambien igual
        conn.query('SELECT * FROM servicio' , (err, servicio) => {  //cambiar select de las tablas y crear el parametro
            if (err) {
                res.json(err)
            }
            console.log(servicio)
            res.render('servicio' , {  //renderiza en archivo vista vehiculos
                data: servicio 
            })
        })
    })
}
controller.saveServicio = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into servicio(descripcion, precio) VALUES ('${data.descripcion}',${data.precio});`, (err, servicio) => { //tipoV hace referencia al resultado del query
            res.redirect('/servicio')
        })
    })
}

controller.editServicio = (req, res) => {
    const {pk_servicio} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from servicio where pk_servicio = ${pk_servicio}`, (err, tipo) =>{
            res.render("./editar/editar_servicio" , {
            data: tipo[0] })
        })
    })
}

controller.updateServicio = (req, res) => {

    const {pk_servicio} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update servicio set descripcion = '${data.descripcion}', precio = ${data.precio} where pk_servicio=${pk_servicio} `, (err, tipoV) => { //vehiculos hace referencia al resultado del query
            res.redirect('/servicio')
        })
    })
}

controller.deleteServicio = (req, res) => {

    const {pk_servicio} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from servicio where pk_servicio = ${pk_servicio}`, (err, tipoV) =>{
            res.redirect("/servicio")
        })
    })
}

//crear usuario cliente
controller.listUserCliente = async (req, res) => {    //linea siempre, solo crearle nomre metodo
    
    const qcliente = await consultarCliente(req)
    const ucliente = await consultarUcliente(req)

    res.render("crear_usuario_cliente", {
        data: ucliente,
        qcliente
    });

    async function consultarUcliente(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `Select uc.pk_ucliente as id_usuario,cl.nombre as cliente,uc.usuario_cliente as usuario,uc.clave_cliente as clave from usuarios_cliente uc inner join cliente cl on uc.fk_cliente = cl.pk_cliente;`,
                    (err, ucliente) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(ucliente);
                        }
                    }
                );
            });
        });
    }

    async function consultarCliente(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `SELECT * FROM cliente`,
                    (err, qcliente) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(qcliente);
                        }
                    }
                );
            });
        });
    }
    /*req.getConnection((err, conn) =>{  //tambien igual
        conn.query('Select uc.pk_ucliente as id_usuario,cl.nombre as cliente,uc.usuario_cliente as usuario,uc.clave_cliente as clave from usuarios_cliente uc inner join cliente cl on uc.fk_cliente = cl.pk_cliente;' , (err, usuario_cliente) => {  //cambiar select de las tablas y crear el parametro
            if (err) {
                res.json(err)
            }
            res.render('crear_usuario_cliente' , {  //renderiza en archivo vista vehiculos
                data: usuario_cliente 
            })
        })
    })*/
}

controller.saveUserCliente = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into usuarios_cliente(fk_cliente, usuario_cliente, clave_cliente) VALUES (${data.cliente},'${data.usuario}','${data.pass}');`, (err, usuario_cliente) => { //tipoV hace referencia al resultado del query
            res.redirect('/usuario_cliente')
        })
    })
}

controller.editUserCliente = (req, res) => {
    const {pk_servicio} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from servicio where pk_servicio = ${pk_servicio}`, (err, tipo) =>{
            res.render("./editar/editar_servicio" , {
            data: tipo[0] })
        })
    })
}

controller.updateUserCliente = (req, res) => {

    const {pk_servicio} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update servicio set descripcion = '${data.descripcion}', precio = ${data.precio} where pk_servicio=${pk_servicio} `, (err, tipoV) => { //vehiculos hace referencia al resultado del query
            res.redirect('/usuario_cliente')
        })
    })
}

controller.deleteUserCliente = (req, res) => {

    const {pk_ucliente} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from usuarios_cliente where pk_ucliente = ${pk_ucliente}`, (err, usuario_cliente) =>{
            res.redirect("/usuario_cliente")
        })
    })
}

//crear usuario admin
controller.listUserEmpleado =  async (req, res) => {    //linea siempre, solo crearle nomre metodo

    const qempleado = await consultarEmpleado(req)
    const uempleado = await consultarUempleado(req)

    res.render("crear_usuario_empleado", {
        data: uempleado,
        qempleado
    });

    async function consultarUempleado(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `Select ue.pk_uempleado as id_usuario,em.nombre as empleado,ue.usuario_empleado as usuario,ue.clave_empleado as clave from usuarios_empleado ue inner join empleado em on ue.fk_empleado = em.pk_empleado;`,
                    (err, uemplado) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(uemplado);
                        }
                    }
                );
            });
        });
    }

    async function consultarEmpleado(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `SELECT * FROM empleado`,
                    (err, qempleado) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(qempleado);
                        }
                    }
                );
            });
        });
    }
    /*req.getConnection((err, conn) =>{  //tambien igual
        conn.query('Select ue.pk_uempleado as id_usuario,em.nombre as empleado,ue.usuario_empleado as usuario,ue.clave_empleado as clave from usuarios_empleado ue inner join empleado em on ue.fk_empleado = em.pk_empleado;' , (err, usuario_empleado) => {  //cambiar select de las tablas y crear el parametro
            if (err) {
                res.json(err)
            }
            res.render('crear_usuario_empleado' , {  //renderiza en archivo vista vehiculos
                data: usuario_empleado 
            })
        })
    })*/
}
controller.saveUserEmpleado = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into usuarios_empleado(fk_empleado, usuario_empleado, clave_empleado) VALUES (${data.empleado},'${data.usuario}','${data.pass}');`, (err, usuario_empleado) => { //tipoV hace referencia al resultado del query
            res.redirect('/usuario_empleado')
        })
    })
}

controller.editUserEmpleado = (req, res) => {
    const {pk_servicio} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from servicio where pk_servicio = ${pk_servicio}`, (err, tipo) =>{
            res.render("./editar/editar_servicio" , {
            data: tipo[0] })
        })
    })
}

controller.updateUserEmpleado = (req, res) => {

    const {pk_servicio} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update servicio set descripcion = '${data.descripcion}', precio = ${data.precio} where pk_servicio=${pk_servicio} `, (err, usuario_empleado) => { //vehiculos hace referencia al resultado del query
            res.redirect('/usuario_cliente')
        })
    })
}

controller.deleteUserEmpleado = (req, res) => {

    const {pk_uempleado} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from usuarios_empleado where pk_uempleado = ${pk_uempleado}`, (err, usuario_empleado) =>{
            res.redirect("/usuario_empleado")
        })
    })
}

//LOGIN Y LOGOUT

controller.login = async (req, res) => {
        const data = req.body;

        req.getConnection((err, conn) =>{
            conn.query(`select * from usuarios_cliente where usuario_cliente = '${data.user}' AND clave_cliente = '${data.pass}'`, (err, usuarioValido) =>{
                /*res.render("./editar/editar_servicio" , {
                data: tipo[0]*/
                console.log(usuarioValido)
                if (usuarioValido.length > 0) {

                req.session.userId = usuarioValido[0].fk_cliente;
                    
                    res.redirect('/menu_user')
                }  else {
                    res.send('usuario o contraseña incorrectos')
                }
            })
        })
}

controller.logout = async (req, res) =>{
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      }
      // Redirige a la página de inicio de sesión u otra página de tu elección
      res.redirect('/');
    });
  }

//LOGIN ADMIN

controller.loginAdmin = async (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) =>{
        conn.query(`select * from usuarios_empleado where usuario_empleado = '${data.user}' AND clave_empleado = '${data.pass}'`, (err, usuarioValido) =>{
            /*res.render("./editar/editar_servicio" , {
            data: tipo[0]*/
            console.log(usuarioValido)
            if (usuarioValido.length > 0) {
                res.redirect('/menu_admin')
            }  else {
                res.send('usuario o contraseña incorrectos')
            }
        })
    })
}
controller.menuEmpleado = (req, res) => {
    res.render('menu_empleado')
}


//MENU USUARIO
controller.menuUser = (req, res) => {
    res.render('menu_user')
}

//MENU USUARIO
controller.menuAdmin = (req, res) => {
    res.render('menu_admin')
}

//index
controller.index = (req, res) => {
    res.render('index')
}

//verificar sesion
controller.verSesion = (req, res) => {
    if (req.session.userId) {
      res.send('El ID de usuario en la sesión es: ' + req.session.userId);
    } else {
      res.send('La sesión no contiene un ID de usuario.');
    }
  }

  //CONTROLADOR COTIZACION
  controller.listCotizacion = (req, res) => {
    const userId = req.session.userId;
    console.log(userId);
    req.getConnection((err, conn) =>{
        conn.query(`SELECT 
        cz.pk_cotizacion AS pk_cotizacion,
        cz.kilometraje_cotizacion AS kilometraje_cotizacion,
        sv.descripcion AS descripcion,
        cz.presupuesto AS presupuesto,
        vh.placa AS placa,
        cz.Est_Cotizacion AS Estado
        from cotizacion cz 
        INNER JOIN 
        vehiculo vh on cz.fk_vehiculo = vh.pk_vehiculo 
        INNER JOIN
        servicio sv on cz.fk_servicio=sv.pk_servicio;
        ` , (err, cotizaciones) => {
            if (err) {
                res.json(err)
            }
            console.log(cotizaciones)
            res.render('cotizacion' , {  //renderiza en archivo vista cotizacion
                data: cotizaciones 
            })
        })
    })
}
controller.saveCotizacion = (req, res) => {
    let data = req.body
    
    console.log('dato de cotizacion a insertar: ', data)
    req.getConnection((err, conn)=>{ //borre presupuesto manual
        conn.query(`insert into cotizacion(kilometraje_cotizacion, fk_servicio, fk_vehiculo) values (${data.kilometraje}, ${data.servicio}, ${data.vehiculo})`, (err, cotizacion) => { //vehiculos hace referencia al resultado del query
            res.redirect('/cotizacion')
        })
    })
}
controller.editCotizacion = async (req, res) => {

    const {pk_cotizacion} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from cotizacion where pk_cotizacion = ${pk_cotizacion}`, (err, cotizaciones) =>{
            res.render("./editar/editar_cotizacion" , {
            data: cotizaciones[0]})
        })
    })
   
}
controller.updateCotizacion = (req, res) => {

    const {pk_cotizacion} = req.params
    let data = req.body
    
    console.log('dato de cotizacion a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`update cotizacion set kilometraje_cotizacion = '${data.kilometraje}' , fk_servicio = '${data.servicio}' , presupuesto = '${data.presupuesto}' , fk_vehiculo = '${data.vehiculo}' where pk_cotizacion = ${pk_cotizacion} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/cotizacion')
        })
    })
}
controller.deleteCotizacion = (req, res) => {

    const {pk_cotizacion} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from cotizacion where pk_cotizacion = ${pk_cotizacion}`, (err, cotizaciones) =>{
            res.redirect("/cotizacion")
        })
    })
}

//CITAS
controller.listcitas = (req, res) => {
    const userId = req.session.userId;
    console.log(userId);
    req.getConnection((err, conn) =>{
        conn.query(`SELECT 
        ct.pk_cita,
        ct.fecha_entrada AS Entrada,
        ct.fecha_salida AS Salida,
        est.descripcion AS Estado,
        cz.presupuesto AS Presupuesto,
        ct.foto AS Foto,
        em.nombre AS Nombre 
        from cita ct 
        INNER JOIN cotizacion cz on ct.fk_cotizacion = cz.pk_cotizacion 
        INNER JOIN empleado em on ct.fk_empleado = em.pk_empleado
        INNER JOIN estados est on ct.estado=est.pk_estados
        WHERE Status = "N";
        ` , (err, cita) => {
            if (err) {
                res.json(err)
            }
            console.log(cita)
            res.render('citas' , {  //renderiza en archivo vista cita
                data: cita 
            })
        })
    })
}

controller.savecita = (req, res) => {
    const userId = req.session.userId;
    let data = req.body
    
    console.log('dato de cita a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`INSERT INTO cita(fecha_entrada,fecha_salida,fk_cotizacion,fk_empleado) values ('${data.entrada}','${data.salida}',${data.cotizacion},${data.Empleado})`, (err, cita) => { //
            res.redirect('/citas')
        })
    })
}

controller.editcita = async (req, res) => {

    const {pk_cita} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from cita where pk_cita = ${pk_cita}`, (err, cita) =>{
            res.render("./editar/editar_cita", {
            data: cita[0]})
        })
    })
   
}
controller.updatecita = (req, res) => {

    const {pk_cita} = req.params
    let data = req.body
    
    console.log('dato de cita a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`update cita set fecha_entrada = '${data.Fecha_Entrada}' , fecha_salida = '${data.Fecha_Salida}' , estado = '${data.Estado}' , foto = '${data.Foto}', fk_empleado = '${data.Empleado}' where pk_cita = ${pk_cita} `, (err, cita) => { //vehiculos hace referencia al resultado del query
            res.redirect('/citas')
        })
    })
}
controller.deletecita = (req, res) => {

    const {pk_cita} = req.params

    req.getConnection((err, conn)=>{
        conn.query(`update cita set Status = 'Y' where  pk_cita = ${pk_cita}`, (err, cita) =>{
            res.redirect("/citas")
        })
    })
}

//Cita Cliente
controller.listCitasCliente = (req, res) => {
    const userId = req.session.userId;
    req.getConnection((err, conn) =>{
        conn.query(`SELECT 
        ct.pk_cita,
        ct.fecha_entrada AS Entrada,
        ct.fecha_salida AS Salida,
        est.Descripcion AS Estado,
        cz.presupuesto AS Presupuesto,
        ct.foto AS Foto,
        em.nombre AS Nombre 
        from cita ct 
        INNER JOIN cotizacion cz on ct.fk_cotizacion = cz.pk_cotizacion 
        INNER JOIN empleado em on ct.fk_empleado = em.pk_empleado
        INNER JOIN estados est on ct.estado=est.pk_estados
        INNER JOIN vehiculo vh on cz.fk_vehiculo = vh.pk_vehiculo
        WHERE Status = "N" AND vh.fk_cliente = ${userId};
        ` , (err, cita) => {
            if (err) {
                res.json(err)
                return;
            }
            console.log(cita)
            res.render('citas_cliente' , {  //renderiza en archivo vista cita
                data: cita 
            })
        })
    })
}

controller.listBitacora = (req, res) => {
    const userId = req.session.userId;
    req.getConnection((err, conn) =>{
        conn.query(`SELECT 
        bi.pk_bitacora,
		bi.fk_cita,
        bi.Fecha_Ingresada,
        ci.fecha_entrada,
        ci.fecha_salida,
        ci.fk_cotizacion,
        co.fk_servicio,
        se.descripcion AS servicio,
        ve.fk_cliente AS cliente,
        ve.placa
        from bitacora bi 
        INNER JOIN cita ci on bi.fk_cita = ci.pk_cita
        INNER JOIN cotizacion co on ci.fk_cotizacion = co.pk_cotizacion 
        INNER JOIN servicio se on co.fk_servicio = se.pk_servicio
        INNER JOIN vehiculo ve on co.fk_vehiculo = ve.pk_vehiculo
        WHERE ve.fk_cliente = ${userId};
        ` , (err, bitacora) => {
            if (err) {
                res.json(err)
                return;
            }
            res.render('bitacora_cliente' , {  //renderiza en archivo vista cita
                data: bitacora 
            })
        })
    })
}

module.exports = controller