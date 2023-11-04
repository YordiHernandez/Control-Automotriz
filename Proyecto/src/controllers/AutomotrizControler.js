const { response } = require("express");
const session = require('express-session');
const nodemailer = require('nodemailer')
const multer = require('multer');

const controller = {};

// CONTROLADOR VEHICULO ADMIN
controller.listVehiculeadmin = (req, res) => {
    const userId = req.session.userId;
    const placaFiltro = req.query.placa || ''; // Obtiene la placa de los parámetros de la consulta, si existe
    console.log(userId);

    req.getConnection((err, conn) => {
        let query = `SELECT
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
                    WHERE
                        vh.placa LIKE ?;`;

        // Ejecuta la consulta con el filtro si se proporcionó una placa
        conn.query(query, ['%' + placaFiltro + '%'], (err, vehiculos) => {
            if (err) {
                res.json(err);
            } else {
                // Renderiza la vista con los vehículos filtrados o todos si no hay filtro
                res.render('vehiculosadmin', {
                    data: vehiculos,
                    busqueda: placaFiltro // Pasa el filtro actual a la vista
                });
            }
        });
    });
};


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
    let placaFiltro = req.query.placa; // Obtén el valor del parámetro 'modelo' de la consulta
    let query = `SELECT
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
    WHERE vh.fk_cliente = ?`;

    let queryParams = [userId];

    // Añade la lógica del filtro si 'modelo' es proporcionado en la consulta
    if (placaFiltro) {
        query += ` AND vh.placa LIKE ?`;
        queryParams.push(`%${placaFiltro}%`);
    }

    req.getConnection((err, conn) =>{
        conn.query(query, queryParams, (err, vehiculos) => {
            if (err) {
                res.json(err);
            }
            res.render('vehiculos', { // Renderiza en archivo vista vehiculos
                data: vehiculos
            });
        });
    });
};

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
    let codigoFiltro = req.query.codigo || ''; // Obtén el valor del parámetro 'codigo' de la consulta o un string vacío si no está presente

    req.getConnection((err, conn) =>{
        let query = `SELECT 
            cz.pk_cotizacion AS pk_cotizacion,
            vh.placa AS placa,
            cz.Est_Cotizacion AS Estado,
            cz.Codigo as Codigo,
            cz.Descripcion as Descripcion,
            DATE_FORMAT(cz.fecha_solicitud, '%Y-%m-%d %H:%i:%s') as Fecha
        from cotizacion cz 
        INNER JOIN 
            vehiculo vh on cz.fk_vehiculo = vh.pk_vehiculo 
        WHERE vh.fk_cliente = ${userId} 
            AND cz.Est_Cotizacion = 'En Espera'`;

        // Si se proporcionó un código de filtro, añádelo a la consulta
        if (codigoFiltro) {
            query += ` AND cz.Codigo LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(query, [codigoFiltro], (err, cotizaciones) => { // Asegúrate de que el placeholder '?' corresponda a los parámetros que añades
            if (err) {
                res.json(err);
            } else {
                console.log(cotizaciones);
                res.render('cotizacion', { //renderiza en archivo vista cotizacion con los datos filtrados
                    data: cotizaciones,
                    busqueda: req.query.codigo || '' // Mantén el término de búsqueda en el campo de entrada
                });
            }
        });
    });
};

controller.saveCotizacion = (req, res) => {
    let data = req.body

    const fechaHoraString = data.fechaHora; // Asumiendo que data.fechaHora es una cadena válida
    const fechaHoraDate = new Date(fechaHoraString);
    const fechaHoraLocal = new Date(fechaHoraDate.getTime() - (fechaHoraDate.getTimezoneOffset() * 60000));
    const fechaFormateada = fechaHoraLocal.toISOString().slice(0, 19).replace('T', ' ');
    //const fechaFormateada = data.fechaHora.toISOString().slice(0,19).replace('T', ' ');
    console.log('dato de cotizacion a insertar: ', data, 'y fecha: ', fechaFormateada)
    req.getConnection((err, conn)=>{ //borre presupuesto manual
        conn.query(`insert into cotizacion(fk_vehiculo, fecha_solicitud, Descripcion) values (${data.vehiculo},'${fechaFormateada}','${data.descripcion}')`, (err, cotizacion) => { //vehiculos hace referencia al resultado del query
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
        conn.query(`update cotizacion set kilometraje_cotizacion = '${data.kilometraje}' , fk_servicio = '${data.servicio}', fk_vehiculo = '${data.vehiculo}' where pk_cotizacion = ${pk_cotizacion} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
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
    let codigoFiltro = req.query.codigo || ''; // Obtén el valor del parámetro 'codigo' de la consulta o un string vacío si no está presente
    let query = `SELECT 
        ct.pk_cita,
        cz.CODIGO as cotizacion,
        em.nombre as empleado,
        ct.presupuesto as presupuesto,
        ct.detalle as detalle,
        ct.tiempo_estimado as tiempo,
        ct.estado,
        ct.file_name as foto
        from cita ct 
        INNER JOIN cotizacion cz on ct.fk_cotizacion = cz.pk_cotizacion 
        INNER JOIN empleado em on ct.fk_empleado = em.pk_empleado
        WHERE ct.Status = "N"`;

    // Si el filtro de código está presente, añadir la condición WHERE para la búsqueda
    if (codigoFiltro) {
        query += ` AND cz.CODIGO LIKE ?`;
    }

    req.getConnection((err, conn) =>{
        // Utiliza un placeholder '?' para evitar inyección SQL si hay un filtro de búsqueda
        conn.query(query, [`%${codigoFiltro}%`], (err, citas) => {
            if (err) {
                res.json(err);
            } else {
                res.render('citas', {  // Renderiza en archivo vista citas con los datos filtrados
                    data: citas,
                    busqueda: codigoFiltro // Pasa el valor de búsqueda a la vista
                });
            }
        });
    });
};


controller.savecita = (req, res) => {
    console.log('Entrar a funcion');
    const data = req.body;
    const archivo = req.file;
    const nombreArchivo = archivo.originalname;
    if (!archivo) {
        // Manejar el caso en el que no se suba un archivo
        return res.status(400).send('Debes seleccionar un archivo.');
      }
    console.log('archivo: ', archivo)
    console.log('nombre de archivo: ', nombreArchivo)

    req.getConnection((err, conn)=>{
        conn.query(`INSERT INTO cita(fk_cotizacion, fk_empleado, presupuesto, detalle, tiempo_estimado, file_name) values (${data.cotizacion},${data.empleado},${data.presupuesto},'${data.detalle}', '${data.tiempo_estimado}', '${nombreArchivo}')`, (err, cita) => { //
            res.redirect('/citas')
        })
    })
    console.log('Datos a enviar: ', req.body)
}

controller.editcita = async (req, res) => {

    const {pk_cita} = req.params

    const qcotizacion = await consultarCotizacion(req) 

    const qempleado = await consultarEmpleado(req) 


    const citas = await consultarcitas(req, pk_cita);


    res.render("./editar/editar_cita", {
        data: citas[0],
        qcotizacion,
        qempleado
    });

    async function consultarcitas(req, pk_cita) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `select * from cita where pk_cita = ${pk_cita}`,
                    (err, citas) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(citas);
                        }
                    }
                );
            });
        });
    }

    async function consultarCotizacion(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query('SELECT * FROM cotizacion cz inner join vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo WHERE Est_Cotizacion = "Aceptada"', 
                    (err, cotizacion) => {
                            resolve(cotizacion);
                    });    
            });
        });
    }

    async function consultarEmpleado(req) {
    
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query(`SELECT * FROM empleado`, (err, empleado) => {       
                            resolve(empleado);
                    });
            });
        })
    }
}

controller.updatecita = (req, res) => {

    const {pk_cita} = req.params
    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`update cita set fk_cotizacion = ${data.cotizacion}, fk_empleado = ${data.empleado}, detalle = '${data.detalle}', presupuesto = ${data.presupuesto}, tiempo_estimado = '${data.tiempo_estimado}' where pk_cita = ${pk_cita} `, (err, cita) => { //vehiculos hace referencia al resultado del query
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
    let codigoFiltro = req.query.codigo; // Obtiene el valor del parámetro 'codigo' de la consulta, si existe

    req.getConnection((err, conn) => {
        let sqlQuery = `
        SELECT 
            ct.pk_cita,
            cz.CODIGO as cotizacion,
            em.nombre as empleado,
            ct.presupuesto as presupuesto,
            ct.detalle as detalle,
            ct.tiempo_estimado as tiempo,
            ct.estado as estado,
            ct.file_name as imagen
            from cita ct 
            INNER JOIN cotizacion cz on ct.fk_cotizacion = cz.pk_cotizacion 
            INNER JOIN empleado em on ct.fk_empleado = em.pk_empleado
            INNER JOIN vehiculo vh ON vh.pk_vehiculo = cz.fk_vehiculo
            WHERE Status = "N" AND vh.fk_cliente = ${userId} AND ct.estado != 'Finalizado'`;

        // Si se proporcionó un código, agregue una cláusula WHERE adicional para filtrar por ese código
        if (codigoFiltro) {
            sqlQuery += ` AND cz.CODIGO LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(sqlQuery, codigoFiltro ? [codigoFiltro] : [], (err, citas) => {
            if (err) {
                res.json(err);
                return;
            }
            // Renderiza la vista 'citas_cliente' con los datos filtrados y el término de búsqueda actual
            res.render('citas_cliente', {
                data: citas,
                busqueda: req.query.codigo || ''  // Mantén el valor de búsqueda para mostrar en el input
            });
        });
    });
};


controller.aceptarCita = (req, res) => {

    const {pk_cita} = req.params
    
    req.getConnection((err, conn)=>{
        conn.query(`update cita set estado = 'Aceptada' where pk_cita = ${pk_cita} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/citas_cliente')
        })
    })
}

controller.denegarCita = (req, res) => {

    const {pk_cita} = req.params
    
    req.getConnection((err, conn)=>{
        conn.query(`update cita set estado = 'Denegada' where pk_cita = ${pk_cita} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/citas_cliente')
        })
    })
}

//NOTIFICACION CITAS CLIENTE
controller.listCitasClienteNoti = (req, res) => {
    const userId = req.session.userId;
    let codigoFiltro = req.query.codigo; // Obtiene el valor del parámetro 'codigo' de la consulta, si existe
    req.getConnection((err, conn) => {
        let sqlQuery = `SELECT 
            ct.pk_cita,
            cz.CODIGO as cotizacion,
            em.nombre as empleado,
            ct.presupuesto as presupuesto,
            ct.detalle as detalle,
            ct.tiempo_estimado as tiempo,
            ct.estado as estado,
            ct.file_name as imagen
            from cita ct 
            INNER JOIN cotizacion cz on ct.fk_cotizacion = cz.pk_cotizacion 
            INNER JOIN empleado em on ct.fk_empleado = em.pk_empleado
            INNER JOIN vehiculo vh ON vh.pk_vehiculo = cz.fk_vehiculo
            WHERE vh.fk_cliente = ${userId} AND ct.estado = 'En Espera'`;
        
        // Si se proporcionó un código, agregue una cláusula WHERE adicional para filtrar por ese código
        if (codigoFiltro) {
            sqlQuery += ` AND cz.CODIGO LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(sqlQuery, codigoFiltro ? [codigoFiltro] : [], (err, cita) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(cita);
            res.render('citas_cliente_noti', {  //renderiza en archivo vista cita
                data: cita,
                busqueda: req.query.codigo || ''  // Mantén el valor de búsqueda para mostrar en el input
            });
        });
    });
};


controller.aceptarCitaNoti = (req, res) => {

    const {pk_cita} = req.params
    
    req.getConnection((err, conn)=>{
        conn.query(`update cita set estado = 'Aceptada' where pk_cita = ${pk_cita} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/citas_cliente_noti')
        })
    })
}

controller.denegarCitaNoti = (req, res) => {

    const {pk_cita} = req.params
    
    req.getConnection((err, conn)=>{
        conn.query(`update cita set estado = 'Denegada' where pk_cita = ${pk_cita} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/citas_cliente_noti')
        })
    })
}

//pagos usuario
controller.listPagosCliente = (req, res) => {
    const userId = req.session.userId;
    let codigoFiltro = req.query.codigo; // Obtiene el valor del parámetro 'codigo' de la consulta, si existe
    req.getConnection((err, conn) => {
        let sqlQuery = `select pa.pk_pago,  
        DATE_FORMAT(pa.fecha, '%Y-%m-%d %H:%i:%s') as fecha,
        pa.tipo as tipo, 
        co.CODIGO as cotizacion, 
        ci.presupuesto as cantidad,
        cl.nombre as cliente
        FROM pago pa 
        INNER JOIN cita ci ON ci.pk_cita = pa.fk_cita
        INNER JOIN cotizacion co ON co.pk_cotizacion = ci.fk_cotizacion
        INNER JOIN vehiculo ve ON ve.pk_vehiculo = co.fk_vehiculo
        INNER JOIN cliente cl ON cl.pk_cliente = ve.fk_cliente
        INNER JOIN cuerpo_cita cc ON cc.fk_cita = ci.pk_cita
        WHERE cl.pk_cliente = ${userId}`;
        
        // Si se proporcionó un código, agregue una cláusula WHERE adicional para filtrar por ese código
        if (codigoFiltro) {
            sqlQuery += ` AND co.CODIGO LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(sqlQuery, codigoFiltro ? [codigoFiltro] : [], (err, cita) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(cita);
            res.render('pago_user', {  //renderiza en archivo vista cita
                data: cita,
                busqueda: req.query.codigo || ''  // Mantén el valor de búsqueda para mostrar en el input
            });
        });
    });
};


//CUERPO DE CITA
controller.listCuerpoCita = (req, res) => {
    let codigoFiltro = req.query.codigo; // Obtiene el valor del parámetro 'codigo' de la consulta, si existe
    req.getConnection((err, conn) => {
        let sqlQuery = `SELECT 
            cc.pk_cuerpo AS pk_cuerpo,
            cc.fk_cita AS cita,
            cc.fk_servicio AS fk_servicio,
            se.descripcion as servicio,
            co.pk_cotizacion as idcoti,
            co.CODIGO as cotizacion,
            cc.detalle as detalle,
            cc.estado as estado,
            cc.file_name as imagen
            from cuerpo_cita cc
            INNER JOIN 
            servicio se on se.pk_servicio = cc.fk_servicio
            INNER JOIN
            cita ci on ci.pk_cita = cc.fk_cita
            INNER JOIN
            cotizacion co on co.pk_cotizacion = ci.fk_cotizacion
            WHERE cc.estado != 'Finalizado'`;

        // Si se proporcionó un código, agregue una cláusula WHERE adicional para filtrar por ese código
        if (codigoFiltro) {
            sqlQuery += ` AND co.CODIGO LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(sqlQuery, codigoFiltro ? [codigoFiltro] : [], (err, cuerpo_cita) => {
            if (err) {
                res.json(err);
                return;
            }
            // Renderiza la vista 'cuerpo_cita' con los datos filtrados y el término de búsqueda actual
            res.render('cuerpo_cita', {
                data: cuerpo_cita,
                busqueda: req.query.codigo || ''  // Mantén el valor de búsqueda para mostrar en el input
            });
        });
    });
};

controller.preSaveCuerpoCita = async (req, res) => {
    const {pk_cita} = req.params

    const qServicio = await consultarServicio(req) 

    res.render("./crear/crear_cuerpo_cita", {
        pk_cita,
        qServicio
    });

    async function consultarServicio(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query(`SELECT * FROM servicio`, (err, servicio) => {       
                            resolve(servicio);
                    });
            });
        })
    }
}
controller.saveCuerpoCita = (req, res) => {
    console.log('Entrar a funcion');
    const data = req.body;
    const archivo = req.file;
    const nombreArchivo = archivo.originalname;
    if (!archivo) {
        // Manejar el caso en el que no se suba un archivo
        return res.status(400).send('Debes seleccionar un archivo.');
      }
    console.log('archivo: ', archivo)
    console.log('nombre de archivo: ', nombreArchivo)

    req.getConnection((err, conn)=>{
        conn.query(`INSERT INTO cuerpo_cita(fk_cita, fk_servicio, detalle, file_name) values (${data.cita},${data.servicio}, '${data.detalle}' , '${nombreArchivo}')`, (err, cuerpo_cita) => { //
            res.redirect('/cuerpo_cita')
        })
    })
    console.log('Datos a enviar: ', req.body)
}
controller.cuerpoCitaRepacion =  (req, res) => {  
    const {pk_cuerpo} = req.params

    req.getConnection((err, conn)=>{
        conn.query(`update cuerpo_cita set estado = 'En Reparacion' where pk_cuerpo = ${pk_cuerpo};`, (err, cuerpo_cita) => { //
            res.redirect('/cuerpo_cita')
        })
    }) 
}
controller.cuerpoCitaPago = async (req, res) => {  
    const {pk_cuerpo} = req.params
    const {pk_cotizacion} = req.params
    const {CODIGO} = req.params

    const qcorreo = await consultarCorreo(req);
    req.getConnection((err, conn)=>{
        conn.query(`update cuerpo_cita set estado = 'Proceder a Pago' where pk_cuerpo = ${pk_cuerpo};`, (err, cuerpo_cita) => { //
            res.redirect('/cuerpo_cita')
        })
    }) 
    const {transporter} = require('../app')
    await transporter.sendMail( {
        from: 'tallereltridente@gmail.com',
        to: qcorreo[0].correo,
        subject: 'Su Cotizacion a sido aceptada',
        text: `Gracias por elegir nuestro servicio, su cotizacion ->${CODIGO}<- a sido finalizada, puede llegar a recoger su carro y proceder a pagar`
    }); //si quiero enviar variables sera en html en vez de text
    async function consultarCorreo(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query(`select cl.correo FROM cotizacion cz 
                    INNER JOIN vehiculo ve ON ve.pk_vehiculo = cz.fk_vehiculo 
                    INNER JOIN cliente cl ON cl.pk_cliente = ve.fk_cliente
                    WHERE cz.pk_cotizacion = ${pk_cotizacion};`, (err, correo) => {
                            resolve(correo);
                    });    
            });
        });
    }
}


//CUERPO DE CITA CLIENTE
controller.listCuerpoCitaCliente = (req, res) => {
    const userId = req.session.userId;
    let codigoFiltro = req.query.codigo; // Obtiene el valor del parámetro 'codigo' de la consulta, si existe

    req.getConnection((err, conn) => {
        let sqlQuery = `
        SELECT 
            cc.pk_cuerpo AS pk_cuerpo,
            cc.fk_cita AS cita,
            cc.fk_servicio AS fk_servicio,
            se.descripcion as servicio,
            co.CODIGO as cotizacion,
            cc.detalle as detalle,
            cc.estado as estado,
            cc.file_name as imagen
            from cuerpo_cita cc
            INNER JOIN 
            servicio se on se.pk_servicio = cc.fk_servicio
            INNER JOIN
            cita ci on ci.pk_cita = cc.fk_cita
            INNER JOIN
            cotizacion co on co.pk_cotizacion = ci.fk_cotizacion
            INNER JOIN 
            vehiculo ve on ve.pk_vehiculo = co.fk_vehiculo
            WHERE ve.fk_cliente = ${userId} AND cc.estado != 'Finalizado'`;

        // Si se proporcionó un código, agregue una cláusula WHERE adicional para filtrar por ese código
        if (codigoFiltro) {
            sqlQuery += ` AND co.CODIGO LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(sqlQuery, codigoFiltro ? [codigoFiltro] : [], (err, cuerpo_cita) => {
            if (err) {
                res.json(err);
                return;
            }
            // Renderiza la vista 'cuerpo_cita_cliente' con los datos filtrados y el término de búsqueda actual
            res.render('cuerpo_cita_cliente', {
                data: cuerpo_cita,
                busqueda: req.query.codigo || ''  // Mantén el valor de búsqueda para mostrar en el input
            });
        });
    });
};


//bitacora cliente
controller.listBitacora = (req, res) => {
    const userId = req.session.userId;
    const codigoFiltro = req.query.codigo;
    const placaFiltro = req.query.placa;

    req.getConnection((err, conn) => {
        let sqlQuery = `Select bc.pk_bitacora, cl.pk_cliente, cz.CODIGO, cl.nombre, vh.placa, ct.presupuesto, ct.detalle, ct.estado, DATE_FORMAT(cz.fecha_solicitud, '%Y-%m-%d %H:%i:%s') as fecha from bitacora bc 
        INNER JOIN cita ct on bc.fk_cita = ct.pk_cita 
        INNER JOIN cotizacion cz ON ct.fk_cotizacion = cz.pk_cotizacion
        INNER JOIN vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo 
        INNER JOIN cliente cl ON cl.pk_cliente = vh.fk_cliente 
        where cl.pk_cliente = ${userId}`;

        let queryParams = [];

        if (codigoFiltro) {
            sqlQuery += ` AND cz.CODIGO LIKE ?`;
            queryParams.push(`%${codigoFiltro}%`);
        }
        if (placaFiltro) {
            sqlQuery += ` AND vh.placa LIKE ?`;
            queryParams.push(`%${placaFiltro}%`);
        }

        conn.query(sqlQuery, queryParams, (err, bitacora) => {
            if (err) {
                res.json(err);
                return;
            }
            res.render('bitacora_cliente', {
                data: bitacora,
                busquedaCodigo: req.query.codigo || '',
                busquedaPlaca: req.query.placa || ''
            });
        });
    });
};

//bitacora administrador
controller.listBitacoraadmin = (req, res) => {
    const codigoFiltro = req.query.codigo;
    const placaFiltro = req.query.placa;

    req.getConnection((err, conn) => {
        let sqlQuery = `Select bc.pk_bitacora, cz.CODIGO, cl.nombre, vh.placa, ct.presupuesto, ct.detalle, ct.estado, DATE_FORMAT(cz.fecha_solicitud, '%Y-%m-%d %H:%i:%s') as fecha from bitacora bc 
        INNER JOIN cita ct on bc.fk_cita = ct.pk_cita 
        INNER JOIN cotizacion cz ON ct.fk_cotizacion = cz.pk_cotizacion
        INNER JOIN vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo 
        INNER JOIN cliente cl ON vh.fk_cliente = cl.pk_cliente`;

        let queryParams = [];

        if (codigoFiltro) {
            sqlQuery += ` WHERE cz.CODIGO LIKE ?`;
            queryParams.push(`%${codigoFiltro}%`);
        }

        if (placaFiltro) {
            sqlQuery += codigoFiltro ? ` AND` : ` WHERE`;
            sqlQuery += ` vh.placa LIKE ?`;
            queryParams.push(`%${placaFiltro}%`);
        }

        conn.query(sqlQuery, queryParams, (err, bitacora) => {
            if (err) {
                res.json(err);
                return;
            }
            res.render('bitacora_admin', {
                data: bitacora,
                busquedaCodigo: codigoFiltro || '',
                busquedaPlaca: placaFiltro || ''
            });
        });
    });
};



  //CONTROLADOR COTIZACION ADMIN
  controller.listCotizacionAdmin = (req, res) => {
    const userId = req.session.userId;
    const codigoFiltro = req.query.codigo || ''; // Obtiene el código de los parámetros de la consulta, si existe
    console.log(userId);

    req.getConnection((err, conn) => {
        let query = `SELECT 
                        cz.pk_cotizacion AS pk_cotizacion,
                        vh.placa AS placa,
                        cz.Est_Cotizacion AS Estado,
                        cz.Codigo as Codigo,
                        cz.Descripcion as Descripcion,
                        DATE_FORMAT(cz.fecha_solicitud, '%Y-%m-%d %H:%i:%s') as Fecha
                    from cotizacion cz 
                    INNER JOIN 
                        vehiculo vh on cz.fk_vehiculo = vh.pk_vehiculo
                    WHERE
                        cz.Codigo LIKE ?;`;

        // Ejecuta la consulta con el filtro si se proporcionó un código
        conn.query(query, ['%' + codigoFiltro + '%'], (err, cotizaciones) => {
            if (err) {
                res.json(err);
            } else {
                // Renderiza la vista con las cotizaciones filtradas o todas si no hay filtro
                res.render('cotizacionadmin', {
                    data: cotizaciones,
                    busqueda: codigoFiltro // Pasa el filtro actual a la vista
                });
            }
        });
    });
};

//Pagos
controller.listpagos = async (req, res) => {    //linea siempre, solo crearle nomre metod
    let codigoFiltro = req.query.codigo; // Obtiene el valor del parámetro 'codigo' de la consulta, si existe
    const qcotizacion = await consultarCotizacion(req)

    req.getConnection((err, conn) => {
        let sqlQuery = `select pa.pk_pago,  
        DATE_FORMAT(pa.fecha, '%Y-%m-%d %H:%i:%s') as fecha,
        pa.tipo as tipo, 
        co.CODIGO as cotizacion, 
        ci.presupuesto as cantidad,
        cl.nombre as cliente
        FROM pago pa 
        INNER JOIN cita ci ON ci.pk_cita = pa.fk_cita
        INNER JOIN cotizacion co ON co.pk_cotizacion = ci.fk_cotizacion
        INNER JOIN vehiculo ve ON ve.pk_vehiculo = co.fk_vehiculo
        INNER JOIN cliente cl ON cl.pk_cliente = ve.fk_cliente
        INNER JOIN cuerpo_cita cc ON cc.fk_cita = ci.pk_cita`;
        
        // Si se proporcionó un código, agregue una cláusula WHERE adicional para filtrar por ese código
        if (codigoFiltro) {
            sqlQuery += ` AND cz.CODIGO LIKE ?`;
            codigoFiltro = `%${codigoFiltro}%`;
        }

        conn.query(sqlQuery, codigoFiltro ? [codigoFiltro] : [], (err, cita) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(cita);
            res.render('pago_admin', {  //renderiza en archivo vista cita
                data: cita,
                busqueda: req.query.codigo || '',  // Mantén el valor de búsqueda para mostrar en el input
                qcotizacion 
            });
        });
    });
    
    async function consultarCotizacion(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                conn.query(
                    `SELECT co.CODIGO as cotizacion, ci.pk_cita as cita, cc.pk_cuerpo as cuerpo FROM cita ci 
                    INNER JOIN cotizacion co ON co.pk_cotizacion = ci.fk_cotizacion
                    INNER JOIN cuerpo_cita cc ON cc.fk_cita = ci.pk_cita
                    WHERE cc.estado = "Proceder a Pago"`,
                    (err, qcotizacion) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(qcotizacion);
                        }
                    }
                );
            });
        });
    }


}

controller.savePagos = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into pago(fk_cita, tipo) VALUES (${data.cotizacion},'${data.tipo}');`, (err, pago) => { //tipoV hace referencia al resultado del query
            res.redirect('/pago_admin')
        })
    })
}


// cotizacion
controller.aceptarCotizacion = (req, res) => {

    const {pk_cotizacion} = req.params
    
    req.getConnection((err, conn)=>{
        conn.query(`update cotizacion set Est_Cotizacion = 'Aceptada' where pk_cotizacion = ${pk_cotizacion} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/cotizacionadmin')
        })
    })
}

controller.denegarCotizacion = (req, res) => {

    const {pk_cotizacion} = req.params
    
    req.getConnection((err, conn)=>{
        conn.query(`update cotizacion set Est_Cotizacion = 'Denegada' where pk_cotizacion = ${pk_cotizacion} `, (err, cotizaciones) => { //vehiculos hace referencia al resultado del query
            res.redirect('/cotizacionadmin')
        })
    })
}

//ENVIO DE CORREOS COTIZACION ADMIN
controller.correoAceptado = async ( req, res) => {

    const {CODIGO} = req.params
    const {pk_cotizacion} = req.params

    const qcorreo = await consultarCorreo(req);

    const {transporter} = require('../app')
    await transporter.sendMail( {
        from: 'tallereltridente@gmail.com',
        to: qcorreo[0].correo,
        subject: 'Su Cotizacion a sido aceptada',
        text: `Gracias por elegir nuestro servicio, su cotizacion ->${CODIGO}<- a sido aceptada`
    }); //si quiero enviar variables sera en html en vez de text
    res.redirect('/cotizacionadmin')

    async function consultarCorreo(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query(`select cl.correo FROM cotizacion cz 
                    INNER JOIN vehiculo ve ON ve.pk_vehiculo = cz.fk_vehiculo 
                    INNER JOIN cliente cl ON cl.pk_cliente = ve.fk_cliente
                    WHERE cz.pk_cotizacion = ${pk_cotizacion};`, (err, correo) => {
                            resolve(correo);
                    });    
            });
        });
    }
}

controller.correoDenegado = async ( req, res) => {

    const {CODIGO} = req.params
    const {pk_cotizacion} = req.params

    const qcorreo = await consultarCorreo(req);

    const {transporter} = require('../app')
    await transporter.sendMail( {
        from: 'tallereltridente@gmail.com',
        to: qcorreo[0].correo,
        subject: 'Su Cotizacion a sido aceptada',
        text: `Gracias por elegir nuestro servicio, su cotizacion ->${CODIGO}<- a sido denegada`
    }); //si quiero enviar variables sera en html en vez de text
    res.redirect('/cotizacionadmin')

    async function consultarCorreo(req) {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                    conn.query(`select cl.correo FROM cotizacion cz 
                    INNER JOIN vehiculo ve ON ve.pk_vehiculo = cz.fk_vehiculo 
                    INNER JOIN cliente cl ON cl.pk_cliente = ve.fk_cliente
                    WHERE cz.pk_cotizacion = ${pk_cotizacion};`, (err, correo) => {
                            resolve(correo);
                    });    
            });
        });
    }
}



module.exports = controller