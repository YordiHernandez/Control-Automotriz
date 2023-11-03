CREATE DATABASE automotriz;
USE automotriz;

CREATE TABLE IF NOT EXISTS `cliente`(
pk_cliente INT AUTO_INCREMENT NOT NULL,
nombre VARCHAR(256) NOT NULL,
correo VARCHAR(256) NOT NULL,
dpi VARCHAR(256) NOT NULL,
numero INT(8) NOT NULL,
direccion_cliente VARCHAR(256) NOT NULL,
PRIMARY KEY(`pk_cliente`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
select * from cliente;

CREATE TABLE IF NOT EXISTS `empleado`(
pk_empleado INT AUTO_INCREMENT NOT NULL,
nombre VARCHAR(256) NOT NULL,
correo VARCHAR(256) NOT NULL,
dpi VARCHAR(256) NOT NULL,
numero INT(8) NOT NULL,
direccion_Empleado VARCHAR(256) NOT NULL,
PRIMARY KEY(`pk_Empleado`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `usuarios_cliente`(
pk_ucliente INT AUTO_INCREMENT NOT NULL,
usuario_cliente VARCHAR(256) NOT NULL,
clave_cliente VARCHAR(256) NOT NULL,
fk_cliente INT,
PRIMARY KEY(`pk_ucliente`),
FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`pk_cliente`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `usuarios_empleado`(
pk_uempleado INT AUTO_INCREMENT NOT NULL,
usuario_empleado VARCHAR(256) NOT NULL,
clave_empleado VARCHAR(256) NOT NULL,
fk_empleado INT,
PRIMARY KEY(`pk_uempleado`),
FOREIGN KEY (`fk_empleado`) REFERENCES `empleado` (`pk_Empleado`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `marca` (
pk_marca INT AUTO_INCREMENT NOT NULL,
descripcion varchar(256) NOT NULL,
PRIMARY KEY (pk_marca)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `tipo_vehiculo` (
pk_tipo INT AUTO_INCREMENT NOT NULL,
descripcion varchar(256) NOT NULL,
PRIMARY KEY (pk_tipo)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `vehiculo`(
pk_vehiculo INT AUTO_INCREMENT NOT NULL,
fk_marca INT NOT NULL,
fk_tipo INT NOT NULL,
modelo VARCHAR(256) NOT NULL,
placa VARCHAR(256) NOT NULL,
color VARCHAR(256) NOT NULL,
kilometraje INT NOT NULL,
fk_cliente INT NOT NULL,
PRIMARY KEY(`pk_vehiculo`),
FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`pk_cliente`),
FOREIGN KEY (`fk_marca`) REFERENCES `marca` (`pk_marca`),
FOREIGN KEY (`fk_tipo`) REFERENCES `tipo_vehiculo` (`pk_tipo`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `servicio` (
pk_servicio INT AUTO_INCREMENT NOT NULL,
descripcion VARCHAR(256) NOT NULL,
precio decimal(9,2),
PRIMARY KEY(`pk_servicio`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `cotizacion`( -- SOLICITUD REVISION
pk_cotizacion INT AUTO_INCREMENT NOT NULL,
fk_vehiculo INT NOT NULL,
Est_Cotizacion varchar(256),
CODIGO varchar(16),
Descripcion varchar(512),
fecha_solicitud datetime,
PRIMARY KEY(`pk_cotizacion`),
FOREIGN KEY (`fk_vehiculo`) REFERENCES `vehiculo` (`pk_vehiculo`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8; 


CREATE TABLE IF NOT EXISTS `cita`( -- TABLA DE REVISION
pk_cita INT AUTO_INCREMENT NOT NULL,
fk_cotizacion INT NOT NULL,
fk_empleado INT NOT NULL,
Status varchar(1) default("N"),
presupuesto double,
detalle varchar(256),
tiempo_estimado varchar(256),
estado varchar(256),
file_name varchar(256),
PRIMARY KEY(`pk_cita`),
FOREIGN KEY (`fk_cotizacion`) REFERENCES `cotizacion` (`pk_cotizacion`),
FOREIGN KEY (`fk_empleado`) REFERENCES `empleado` (`pk_empleado`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `bitacora`(
pk_bitacora INT AUTO_INCREMENT NOT NULL,
fk_cita INT NOT NULL,
PRIMARY KEY(`pk_bitacora`),
FOREIGN KEY (`fk_cita`) REFERENCES `cita` (`pk_cita`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `pago`(
pk_pago INT AUTO_INCREMENT NOT NULL,
fecha datetime,
tipo VARCHAR (256) NOT NULL,
cantidad DOUBLE NOT NULL,
fk_cita INT NOT NULL,
PRIMARY KEY(`pk_pago`),
FOREIGN KEY (`fk_cita`) REFERENCES `cita` (`pk_cita`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `cuerpo_cita`(
pk_cuerpo INT auto_increment NOT NULL,
fk_cita INT NOT NULL,
fk_servicio INT NOT NULL,
detalle varchar(528) NOT NULL,
estado varchar(256) NOT NULL,
file_name varchar(256) NOT NULL,
primary key(`pk_cuerpo`),
foreign key (`fk_cita`) references `cita` (`pk_cita`),
foreign key (`fk_servicio`) references `servicio` (`pk_servicio`)
)ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


-- TRIGERS
DELIMITER //
CREATE TRIGGER `citas_estado_default`
BEFORE INSERT ON `cita`
FOR EACH ROW
BEGIN
	SET NEW.estado = "En Espera";
END;
//
DELIMITER 

DELIMITER //
CREATE TRIGGER `cotizacion_revision`
AFTER INSERT ON `cita`
FOR EACH ROW
BEGIN
  UPDATE cotizacion
  SET Est_Cotizacion ="Ingresado"
  WHERE pk_cotizacion = NEW.fk_cotizacion;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `estado_cita_ingresada`
BEFORE INSERT ON `cuerpo_cita`
FOR EACH ROW
BEGIN
  UPDATE cita
  SET estado ="Ingresado"
  WHERE pk_cita = NEW.fk_cita;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `cuerpo_cita_estado`
BEFORE INSERT ON `cuerpo_cita`
FOR EACH ROW
BEGIN
	SET NEW.estado = "Ingresado";
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER G_CODIGO BEFORE INSERT ON cotizacion
FOR EACH ROW
BEGIN
    SET @numero_aleatorio = FLOOR(RAND() * 10000);
    SET NEW.CODIGO = CONCAT('COTI_', @numero_aleatorio);
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER cotizacion_estado
BEFORE INSERT ON cotizacion
FOR EACH ROW
BEGIN
    SET NEW.Est_Cotizacion = "En Espera";
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER bitacora_citas
AFTER INSERT ON cita
FOR EACH ROW
BEGIN
  INSERT INTO bitacora (fk_cita)
  VALUES (NEW.pk_cita);
END;
//
DELIMITER ;



-- PRUEBAS
SELECT 
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
        WHERE ve.fk_cliente = 1;

select * from bitacora;


Select bc.pk_bitacora, cz.CODIGO,ct.presupuesto, ct.detalle, ct.estado,cz.fecha_solicitud from bitacora bc 
INNER JOIN cita ct on bc.fk_cita = ct.pk_cita INNER JOIN cotizacion cz ON ct.fk_cotizacion = cz.pk_cotizacion

select * from vehiculo
Select bc.pk_bitacora, cz.CODIGO,cl.nombre, vh.placa,ct.presupuesto, ct.detalle, ct.estado,cz.fecha_solicitud from bitacora bc 
INNER JOIN cita ct on bc.fk_cita = ct.pk_cita INNER JOIN cotizacion cz ON ct.fk_cotizacion = cz.pk_cotizacion
INNER JOIN vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo INNER JOIN cliente cl ON cl.pk_cliente = 2;

Select bc.pk_bitacora, cl.pk_cliente, cz.CODIGO,cl.nombre, vh.placa,ct.presupuesto, ct.detalle, ct.estado,DATE_FORMAT(cz.fecha_solicitud, '%Y-%m-%d %H:%i:%s') as fecha from bitacora bc 
        INNER JOIN cita ct on bc.fk_cita = ct.pk_cita INNER JOIN cotizacion cz ON ct.fk_cotizacion = cz.pk_cotizacion
        INNER JOIN vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo INNER JOIN cliente cl ON cl.pk_cliente = vh.fk_cliente where cl.pk_cliente = 1;
select * from cotizacion

Select bc.pk_bitacora, cz.CODIGO,cl.nombre, vh.placa,ct.presupuesto, ct.detalle, ct.estado, ct.estado,DATE_FORMAT(cz.fecha_solicitud, '%Y-%m-%d %H:%i:%s') as fecha from bitacora bc 
INNER JOIN cita ct on bc.fk_cita = ct.pk_cita INNER JOIN cotizacion cz ON ct.fk_cotizacion = cz.pk_cotizacion
INNER JOIN vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo INNER JOIN cliente cl ON vh.fk_cliente = cl.pk_cliente;