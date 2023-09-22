const controller = {};

//CONTROLADOR VEHICULO

controller.listVehicule = (req, res) => {
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM vehiculo' , (err, vehiculos) => {
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
        conn.query(`insert into vehiculo(Marca_Vehiculo, Tipo_Vehiculo, Modelo_Vehiculo, Placa_Vehiculo, Color_Vehiculo, Kilometraje_Vehiculo, fk_Id_Cliente_V) values ('${data.marca}','${data.tipo}','${data.modelo}','${data.placa}','${data.color}','${data.kilometraje}',${data.cliente})`, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            console.log(vehiculos)
            res.redirect('/vehiculos')
        })
    })
}

controller.editVehicule = (req, res) => {
    const {pk_Id_Vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from vehiculo where pk_Id_Vehiculo = ${pk_Id_Vehiculo}`, (err, vehiculos) =>{
            res.render("editar_vehiculos" , {
            data: vehiculos[0] })
        })
    })
}

controller.updateVehiculo = (req, res) => {

    const {pk_Id_Vehiculo} = req.params
    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`update vehiculo set Marca_Vehiculo = '${data.marca}' , Tipo_Vehiculo = '${data.tipo}' , Modelo_Vehiculo = '${data.modelo}' , Placa_Vehiculo = '${data.placa}' , Color_Vehiculo = '${data.color}' , Kilometraje_Vehiculo = '${data.kilometraje}' , fk_Id_Cliente_V = ${data.cliente} where pk_Id_Vehiculo = ${pk_Id_Vehiculo} `, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            console.log(vehiculos)
            res.redirect('/')
        })
    })
}

controller.deleteVehiculo = (req, res) => {

    const {pk_Id_Vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from vehiculo where pk_Id_Vehiculo = ${pk_Id_Vehiculo}`, (err, vehiculos) =>{
            res.redirect("/")
        })
    })
}

//CONTROLADORES DE MARCA

controller.listMarca = (req, res) => {
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM marca' , (err, marca) => {
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


module.exports = controller