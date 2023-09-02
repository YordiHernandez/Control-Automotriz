CREATE DATABASE Automotriz;
USE Automotriz;

CREATE TABLE IF NOT EXISTS `Cliente`(
pk_Id_Cliente INT AUTO_INCREMENT NOT NULL,
nombre_Cliente VARCHAR(64) NOT NULL,
Correo_Cliente VARCHAR(16) NOT NULL,
DPI_Cliente VARCHAR(13) NOT NULL,
Numero_Cliente INT(8) NOT NULL,
Direccion_Cliente VARCHAR(128) NOT NULL,
PRIMARY KEY(`pk_Id_Cliente`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Empleado`(
pk_Id_Empleado INT AUTO_INCREMENT NOT NULL,
nombre_Empleado VARCHAR(64) NOT NULL,
Correo_Empleado VARCHAR(16) NOT NULL,
DPI_Empleado VARCHAR(13) NOT NULL,
Numero_Empleado INT(8) NOT NULL,
Direccion_Empleado VARCHAR(128) NOT NULL,
PRIMARY KEY(`pk_Id_Empleado`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Usuarios_Cliente`(
pk_Id_UClientes INT AUTO_INCREMENT NOT NULL,
Usuario_UCliente VARCHAR(64) NOT NULL,
Clave_UCliente VARCHAR(16) NOT NULL,
fk_Id_Cliente INT,
PRIMARY KEY(`pk_Id_UClientes`),
FOREIGN KEY (`fk_Id_Cliente`) REFERENCES `Cliente` (`pk_Id_Cliente`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Usuarios_Empleado`(
pk_Id_UEmpleado INT AUTO_INCREMENT NOT NULL,
Usuario_UEmpleado VARCHAR(64) NOT NULL,
Clave_UEmpleado VARCHAR(16) NOT NULL,
fk_Id_Empleado INT,
PRIMARY KEY(`pk_Id_UEmpleado`),
FOREIGN KEY (`fk_Id_Empleado`) REFERENCES `Empleado` (`pk_Id_Empleado`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Vehículo`(
pk_Id_Vehiculo INT AUTO_INCREMENT NOT NULL,
Marca_Vehiculo VARCHAR(16) NOT NULL,
Tipo_Vehiculo VARCHAR(16) NOT NULL,
Modelo_Vehiculo VARCHAR(16) NOT NULL,
Placa_Vehiculo VARCHAR(15) NOT NULL,
Color_Vehiculo VARCHAR(10) NOT NULL,
Kilometraje_Vehiculo VARCHAR(12) NOT NULL,
fk_Id_Cliente_V INT NOT NULL,
PRIMARY KEY(`pk_Id_Vehiculo`),
FOREIGN KEY (`fk_Id_Cliente_V`) REFERENCES `Cliente` (`pk_Id_Cliente`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Cotizacion`(
pk_Id_Cotizacion INT AUTO_INCREMENT NOT NULL,
Kilometraje_Cotizacion VARCHAR(12) NOT NULL,
Comentario_Cotizacion VARCHAR (256) NOT NULL,
Presupuesto_Cotizacion DOUBLE NOT NULL,
fk_Id_Vehiculo INT NOT NULL,
PRIMARY KEY(`pk_Id_Cotizacion`),
FOREIGN KEY (`fk_Id_Vehiculo`) REFERENCES `Vehículo` (`pk_Id_Vehiculo`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Citas`(
pk_Id_Citas INT AUTO_INCREMENT NOT NULL,
FechaEntrada_Citas VARCHAR(10) NOT NULL,
FechaSalida_Citas VARCHAR (10) NOT NULL,
Estado_Citas VARCHAR(12) NOT NULL,
Foto_Citas BLOB NOT NULL,
fk_Id_Empleado INT NOT NULL,
fk_Id_Cotizacion INT NOT NULL,
PRIMARY KEY(`pk_Id_Citas`),
FOREIGN KEY (`fk_Id_Empleado`) REFERENCES `Empleado` (`pk_Id_Empleado`),
FOREIGN KEY (`fk_Id_Cotizacion`) REFERENCES `Cotizacion` (`pk_Id_Cotizacion`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Bitacora`(
pk_id_bitacora INT AUTO_INCREMENT NOT NULL,
fk_Id_Citas INT NOT NULL,
PRIMARY KEY(`pk_id_bitacora`),
FOREIGN KEY (`fk_Id_Citas`) REFERENCES `Citas` (`pk_Id_Citas`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `Pago`(
pk_id_pago INT AUTO_INCREMENT NOT NULL,
Fecha_pago VARCHAR (10) NOT NULL,
Tipo_pago VARCHAR (12) NOT NULL,
Cantidad_pago DOUBLE NOT NULL,
fk_Id_Cotizacion INT NOT NULL,
PRIMARY KEY(`pk_id_pago`),
FOREIGN KEY (`fk_Id_Cotizacion`) REFERENCES `Cotizacion` (`pk_Id_Cotizacion`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
