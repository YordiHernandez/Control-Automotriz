const controller = {};

controller.list = (req, res) => {
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

controller.save = (req, res) => {

    let data = req.body
    
    console.log('dato de vehiculo a insertar: ', data)
    req.getConnection((err, conn)=>{
        conn.query(`insert into vehiculo(Marca_Vehiculo, Tipo_Vehiculo, Modelo_Vehiculo, Placa_Vehiculo, Color_Vehiculo, Kilometraje_Vehiculo, fk_Id_Cliente_V) values ('${data.marca}','${data.tipo}','${data.modelo}','${data.placa}','${data.color}','${data.kilometraje}',${data.cliente})`, (err, vehiculos) => { //vehiculos hace referencia al resultado del query
            console.log(vehiculos)
            res.redirect('/')
        })
    })
}

controller.edit = (req, res) => {
    const {pk_Id_Vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`select * from vehiculo where pk_Id_Vehiculo = ${pk_Id_Vehiculo}`, (err, vehiculos) =>{
            res.render("editar_vehiculos" , {
            data: vehiculos[0] })
        })
    })
}


controller.update = (req, res) => {

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


controller.delete = (req, res) => {

    const {pk_Id_Vehiculo} = req.params

    req.getConnection((err, conn) =>{
        conn.query(`delete from vehiculo where pk_Id_Vehiculo = ${pk_Id_Vehiculo}`, (err, vehiculos) =>{
            res.redirect("/")
        })
    })
}

module.exports = controller