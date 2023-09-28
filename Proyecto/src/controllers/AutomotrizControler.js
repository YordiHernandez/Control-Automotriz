const controller = {};

//CONTROLADOR VEHICULO

controller.listVehicule = (req, res) => {
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
            res.render('vehiculos' , {  //renderiza en archivo vista vehiculos
                data: vehiculos 
            })
        })
    })
}

controller.saveVehicule = (req, res) => {

    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`insert into vehiculo(fk_marca, fk_tipo, modelo, placa, color, kilometraje, fk_cliente) values ('${data.marca}','${data.tipo}','${data.modelo}','${data.placa}','${data.color}','${data.kilometraje}',${data.cliente})`, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            /*res.render('./crear/crear_vehiculos.ejs')*/
            res.redirect('/vehiculo')
        })
    })
}

controller.editVehicule = (req, res) => {
    const {pk_vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from vehiculo where pk_vehiculo = ${pk_vehiculo}`, (err, vehiculos) =>{
            res.render("./editar/editar_vehiculos" , {
            data: vehiculos[0] })
        })
    })
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
            res.render('clientes' , {  //renderiza en archivo vista tipo
                data: cliente
            })
        })
    })
}

controller.saveCliente = (req, res) => {

    let data = req.body
    
    req.getConnection((err, conn)=>{
        conn.query(`insert into CLIENTE(nombre, correo, dpi, numero, direccion_cliente) VALUES ('${data.nombre}','${data.correo}','${data.dpi}', ${data.numero},'${data.direccion}');`, (err, cliente) => { //tipoV hace referencia al resultado del query
            res.redirect('/cliente')
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

module.exports = controller