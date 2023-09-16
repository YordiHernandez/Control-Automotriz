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
        conn.query(`insert into vehiculo(Marca_Vehiculo, Tipo_Vehiculo, Modelo_Vehiculo, Placa_Vehiculo, Color_Vehiculo, Kilometraje_Vehiculo, fk_Id_Cliente_V) values ('${data.marca}','${data.tipo}','${data.modelo}','${data.placa}',${data.color}','${data.kilometraje}',${data.cliente})`, (err, vehiculos) => {
            console.log(vehiculos)
            res.send('works')
        })
    })
}

module.exports = controller