var productos = [];
var reciente = [];
var recientesItems = [];


//Objeto usuario
function objUsuario(idUsuario, tipoUsuario){
	this.idUsuario = idUsuario,
	this.tipoUsuario = tipoUsuario
}


// Limpiar datos de autenticacino del usuario
function limpiarAutentiacion(){
	datosUsuario = JSON.parse(localStorage.getItem("usuario"));
	if(datosUsuario != null){

		localStorage.removeItem("usuario");
	}	
}

//Realizar el login
function enviarform(){
	error.style.color='red';
	
	const usuarioadmin = "admin";
	const contrasenaadmin ="1234";

	const usuariodueno = "dueno";
	const contrasenadueno ="1234";
	
	
	let idUsuario = document.getElementById("idUsuario").value;
	let contrasenaUsuario = document.getElementById("contrasena").value;
	
	let errores = 0;
	
	var mensajeError = [];

	if (idUsuario===""){
		mensajeError.push('Ingresa tu Nombre');
		errores++; 
	}
	if (contrasenaUsuario===""){
		mensajeError.push('Ingresa tu contrasena');
		errores++;
	}
	
	if(idUsuario == usuarioadmin && contrasenaUsuario == contrasenaadmin){

		var usu = new objUsuario(usuariodueno, 1);
		localStorage.removeItem("usuario");
		localStorage.setItem("usuario", JSON.stringify(usu));
		window.location.replace("RealizarCompra.html"),true;

	}
	else{
		mensajeError.push('Datos del usuario inválidos');
		errores++;
	}
	
	if(errores > 0) {
		error.innerHTML=mensajeError.join(' , ');	
		console.log(errores)
		return false;
		
		
	}
	return false;
	
}


//Validar permiso de usuario por pagina
function validarPermisos(tipoPermiso){

	datosUsuario = JSON.parse(localStorage.getItem("usuario"));

	if(datosUsuario != null){

		if(datosUsuario.tipoUsuario != tipoPermiso){
			window.location.replace("Error.html");
		}
		console.log(datosUsuario.idUsuario)

	} else{

		window.location.replace("Login.html");
	}
}




//Valida que haya informacion en todos los campos
function validar(){
	
	

	if(document.getElementById("idCodigo").value == ""){
		alert("Hace falta ingresar el código del producto!");
		return false;
	}

	if(document.getElementById("idNombre").value == ""){
		alert("Hace falta ingresar el nombre del producto!");
		return false;
	}

	if(document.getElementById("idPrecio").value == ""){
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

	if (document.getElementById("idImagen").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

}

function getFile(){
	var resultado="";
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.addEventListener("load", function(){
		resultado = reader.result;
		sessionStorage.setItem("url", resultado);
	},false);

	if (file){
		reader.readAsDataURL(file);
	}
}
//El arreglo en donde se van a almacenar todos los datos en el ingreso de productos
function llenarArreglo(){
	var codigo = document.getElementById("idCodigo").value;
	var nombre = document.getElementById("idNombre").value;
	var precio = document.getElementById("idPrecio").value;
	var imagen = sessionStorage.getItem("url");

	var codigoExiste = false;

	//Agregar el producto al local storage
	if(localStorage.getItem("registro") != null){
		productos = JSON.parse(localStorage.getItem("registro"));
		
		//Recoger el arreglo de productos
		for(var i=0; i<productos.length; i++){
			//Validacion que no puedan haber dos codigos iguales
			if (productos[i].codigo == codigo) {
				codigoExiste = true;
				alert("EL CODIGO INGRESADO YA EXISTE!");
			}

		}
	}

	//Si el codigo no existe
	if(codigoExiste == false){
		
		//Crea el objeto y lo guarda en prod y luego limpia la pantalla 
		var prod = new objproducto(codigo, nombre, precio, imagen,0);
		reciente.push(prod);
		productos.push(prod);
		//localStorage.clear();
		localStorage.removeItem("registro");
		localStorage.setItem("registro", JSON.stringify(productos));
	}
	
}



//Funcion recibe los datos 
function objproducto(codigo, nombre, precio, imagen, cantidad = 0){
	this.codigo = codigo,
	this.nombre = nombre,
	this.precio = precio,
	this.imagen = imagen,
	this.cantidad = cantidad
}
//Actualiza la tabla de productos 
function actualizarTabla(){
	//debugger;
	var scriptTabla="";
	for(var index=0; index<reciente.length; index++){
		scriptTabla+="<tr>";
		scriptTabla+="<td>"+reciente[index].codigo+"</td>";
		scriptTabla+="<td>"+reciente[index].nombre+"</td>";
		scriptTabla+="<td>Q "+reciente[index].precio+"</td>";
		scriptTabla+="<td><img src=\""+reciente[index].imagen+"\" width=\"75px\"></td>";
		scriptTabla+="</tr>";
	}
	document.getElementById("idTableBody").innerHTML = scriptTabla;
}
//Limpia
function limpiar(){
	document.getElementById("idCodigo").value = "";
	document.getElementById("idNombre").value = "";
	document.getElementById("idPrecio").value = "";
	document.getElementById("idImagen").value = "";
}

//Muestra todos los productos guardados
function mostrarProductos(){
	var guardados = [];
	guardados = JSON.parse(localStorage.getItem("registro"));

	var scriptTabla;
	//Recorre el arreglo de productos
	for(var index=0; index<guardados.length; index++){

		scriptTabla+="<tr>";
		scriptTabla+="<td>"+guardados[index].codigo+"</td>";
		scriptTabla+="<td>"+guardados[index].nombre+"<br><br><label for=\""+guardados[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+guardados[index].codigo+"\"></td>";
		scriptTabla+="<td>"+guardados[index].precio+"<br><br><input type=\"button\" value=\"Agregar al carrito\" id=\""+guardados[index].codigo+"\" onclick=\"agregarCarrito(this.id)\"></td>";
		scriptTabla+="<td><img src=\""+guardados[index].imagen+"\" width=\"75px\"></td>";
		scriptTabla+="</tr>";
	}
	//La propiedad innerHTML por medio de un ID nos sirve para cambiar o recuperar datos de una etiqueta, div, p etc
	document.getElementById("idTableBody2").innerHTML = scriptTabla;

}
//Objeto para el pedido
function objpedido(codigo, nombre, precio, imagen, cantidad){
	this.codigo=codigo,
	this.nombre=nombre,
	this.precio=precio,
	this.imagen=imagen,
	this.cantidad=cantidad
}

//Funcion para agregar al carrito
function agregarCarrito(id){

	//debugger;
//variables
	var buscarProductos = [];
	var auxiliar = [];
	var getProducto = [];

	var codigo;
	var nombre;
	var precio;
	var imagen;
	var cantidad;

	buscarProductos = JSON.parse(localStorage.getItem("registro"));

	for(var i=0; i<buscarProductos.length; i++){

		if(buscarProductos[i].codigo == id){
			codigo = buscarProductos[i].codigo;
			nombre = buscarProductos[i].nombre;
			precio = buscarProductos[i].precio;
			imagen = buscarProductos[i].imagen;
			cantidad = document.getElementById("c"+id).value;
		}

	}
	//Valida que el carrito no este vacio
	if(cantidad != "" && cantidad > 0){
		//Guarda la info rn el sesionStorage
		if(JSON.parse(sessionStorage.getItem("regPedido"))!=null){

			var actualizar = false;

			auxiliar = JSON.parse(sessionStorage.getItem("regPedido"));
			//Recorre el arrelo auxiliar para y acualia
			for(var y=0; y<auxiliar.length; y++){
				if(auxiliar[y].codigo == codigo){
					actualizar = true;
					break;
				}
			}
			//Recogge el arreglo para agregala
			if(actualizar == true){
				for(var z=0; z<auxiliar.length; z++){
					if(auxiliar[z].codigo != codigo){
						getProducto.push(auxiliar[z]);
					}
				}

				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);
				//agrega
				getProducto.push(ped);

				sessionStorage.clear();
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
			}else{

				getProducto = auxiliar;

				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

				getProducto.push(ped);

				sessionStorage.clear();
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));

			}

		}else{
			var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

			getProducto.push(ped);

			sessionStorage.clear();
			sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
		}

	}else{

		alert("NO SE HA INGRESADO UNA CANTIDAD!");

	}

}

//Metodo para revisar el pedido se llama en ConfirmarPedido
function revisarPedido(){
	var carrito = [];
	var total = 0;
	//Variable sessionStorage para el registro del pedido
	carrito = JSON.parse(sessionStorage.getItem("regPedido"));

	var scriptTabla;
//Recorre el carrito
	for(var index=0; index<carrito.length; index++){

		scriptTabla+="<tr>";
		scriptTabla+="<td>"+carrito[index].codigo+"</td>";
		scriptTabla+="<td>"+carrito[index].nombre+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>"
		scriptTabla+="<td>"+carrito[index].cantidad+"<br><br><label for=\""+carrito[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+carrito[index].codigo+"\" onchange=\"actualizarCantidad(this.id)\">&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"Descartar\" id=\""+carrito[index].codigo+"\" onclick=\"quitarCarrito(this.id)\"></td>";
		scriptTabla+="<td>Q "+carrito[index].precio+"</td>";
		scriptTabla+="<td>Q "+carrito[index].cantidad*carrito[index].precio+"</td>";
		scriptTabla+="</tr>";
		total+=carrito[index].cantidad*carrito[index].precio;
	}
//Obtiene la informacion con el InnerHTML
	document.getElementById("idTableBody3").innerHTML = scriptTabla;
	document.getElementById("total").innerHTML = "Total compra:&nbsp;&nbsp;&nbsp;&nbsp;Q "+total;
}

//Permite cambiar la cantiad solicitada
function actualizarCantidad(id){
	var nuevoid = id.substring(1);
	
	agregarCarrito(nuevoid);

	revisarPedido();
}

//Funcion Eliminar o descartar del carrito
function quitarCarrito(id){

	var pedidoActual = [];
	var nuevoPedido = [];

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	for(var y=0; y<pedidoActual.length; y++){
		if(pedidoActual[y].codigo != id){
			nuevoPedido.push(pedidoActual[y]);
		}
	}

	sessionStorage.clear();
	sessionStorage.setItem("regPedido", JSON.stringify(nuevoPedido));

	revisarPedido();

}
//Confirmar compra
function validarCompra(){

	var total = document.getElementById("total");
	var contenido = total.innerHTML;

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	if(pedidoActual == null){

		alert("No se han agregado productos al carrito")
		return;
	}

	if(document.getElementById("idNombre").value == ""){
		alert("DEBE INGRESAR SU NOMBRE COMPLETO!");
		return false;
	}

	if(document.getElementById("idDir").value == ""){
		alert("DEBE INGRESAR UNA DIRECCION DE ENTREGA!");
		return false;
	}

}
//Funcion comorar
function comprar(){

	if(validarCompra()==false){
		return false;
	}

	document.getElementById("idNit").value="";
	document.getElementById("idNombre").value="";
	document.getElementById("idDir").value="";

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	

	itemsStock = JSON.parse(localStorage.getItem("stock"));

	for(var m=0; m<pedidoActual.length; m++){

		//console.log(pedidoActual[m])

		for(var j=0; j<itemsStock.length; j++){	

			//Verificar si hay un producto vigente en stock (estado 1)
			if(itemsStock[j].codigoProducto == pedidoActual[m].codigo && itemsStock[j].estado == 1){
				
				var cantidadAnt = parseInt(itemsStock[j].cantidad,10);
				var cantidadNueva = cantidadAnt - parseInt(pedidoActual[m].cantidad,10);
				console.log(cantidadNueva);
				var stock = new objStockItems(pedidoActual[m].codigo, 
					itemsStock[j].codigoOrden, 
					cantidadNueva, 
					itemsStock[j].precio, 
					1);
				
				itemsStock[j].cantidad = cantidadNueva;
				registroAnterior = true;

				//itemsStock.push(stock);
				localStorage.removeItem("stock");
				localStorage.setItem("stock", JSON.stringify(itemsStock));

			}

			
		}

				
	}
	document.getElementById("idTableBody3").innerHTML = "";
	sessionStorage.removeItem("regPedido");




	//sessionStorage.clear();

	alert("Su pedido se registro correctamente!\n Muchas gracias por su compra!");
	window.location.replace("mostrarProductos.html?msg=compra");
	

}

function agregarProducto(){

	if(validar()==false){
		return false;
	}

	llenarArreglo();

	actualizarTabla();

	limpiar();

}


function validarform(){
	
	
	

	if(document.getElementById("idNombre").value == ""){
		alert("Hace falta ingresar el código del producto!");
		return false;
	}

	if(document.getElementById("idApellido").value == ""){
		alert("Hace falta ingresar el nombre del producto!");
		return false;
	}

	if(document.getElementById("idDireccion").value == ""){
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

	if (document.getElementById("idGmail").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}
	if (document.getElementById("idContrasena").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

}

var nombre = document.getElementById ('idNombre');
var contrasena = document.getElementById ('idContrasena');
var error = document.getElementById('error');





function validarlogin()
{

}


/*
updatetable(){
}

limpiarTabla(){

}
*/






var arrProds = [];
function AgregarOC(){
	
	//console.log("agregando")
	var fecha = new Date();
	var codigoOrden = document.getElementById("idOrden").value;
	var fechaEntrega = document.getElementById("fechaE").value;
	var idProveedor = document.getElementById("idProv").value;
	var fechaActual = fecha.getDate() + "/"+ fecha.getMonth()+ "/" +fecha.getFullYear();
	
	var codigoProd = document.getElementById("idProd").value;
	var cantProd = document.getElementById("cantP").value;
	
	if(codigoOrden === "" || fechaEntrega === "" || idProveedor === "" || codigoProd === "" || cantProd === ""){
		
		alert("No se han compleatado los datos requeridos");
		return false;
		
	}
	
	
	var codigoExiste = false;
	
	
	//Verificar si existe la orden de compra para almacenarla
	var existeOrden = false;
	var ordenes = JSON.parse(localStorage.getItem("ordenes"))
	if(ordenes != null){
		ordenesTemp = JSON.parse(localStorage.getItem("ordenes"));
		//Recoger el arreglo de ordenes para verificar que no exista la ingresada
		for(var i=0; i<ordenes.length; i++){
			if(ordenes[i].codigoOrden == codigoOrden){
				existeOrden = true;
				
			}
		}
				
	}
	
	if(!existeOrden){
		var orden = new objOrden(codigoOrden, fechaActual, fechaEntrega, idProveedor, 1);
		
		
		
		recienteOrdenes.push(orden);
		ordenesTemp.push(orden);
		
		localStorage.removeItem("ordenes");
		localStorage.setItem("ordenes", JSON.stringify(ordenesTemp));
	}

	//console.log(existeOrden)
	
	
	
	
	
	//Buscar producto segun codigo codigoP
	
	if(localStorage.getItem("registro") != null){
		productos = JSON.parse(localStorage.getItem("registro"));

		//Recoger el arreglo de productos
		for(var i=0; i<productos.length; i++){
			//Validacion que no puedan haber dos codigos iguales
			if (productos[i].codigo == codigoProd) {
				
				if(localStorage.getItem("ordenItems") != null){
					itemsOrdenesTemp = JSON.parse(localStorage.getItem("ordenItems"));
				}
				var prod = new objOrdenItems(codigoOrden, productos[i].codigo, productos[i].nombre, productos[i].precio, cantProd);
				
				
				recientesItems.push(prod);
				itemsOrdenesTemp.push(prod);
				
				
				
				localStorage.removeItem("ordenItems");
				localStorage.setItem("ordenItems", JSON.stringify(itemsOrdenesTemp));
				
				codigoExiste = true;
				
			}

		}
	}
	
	//console.log(arrProds);
	//return;
	
	
	if(!codigoExiste){
		alert("No se encontró el producto solicitado");
	} else{
		
		var scriptTabla="";
		for(var index=0; index<recientesItems.length; index++){
			scriptTabla+="<tr>";
			scriptTabla+="<td>"+recientesItems[index].codigoProducto+"</td>";
			scriptTabla+="<td>"+recientesItems[index].nombreProducto+"</td>";
			scriptTabla+="<td>Q "+recientesItems[index].precio+"</td>";
			scriptTabla+="<td>"+recientesItems[index].cantidad+"</td>";
			
			var subTotal = recientesItems[index].precio * recientesItems[index].cantidad;
			
			scriptTabla+="<td>Q "+subTotal+"</td>";
			scriptTabla+="</tr>";
		}
		
		document.getElementById("tablaProductosBody").innerHTML = scriptTabla;
		
		document.getElementById("idProd").value = "";
		document.getElementById("cantP").value = "";
		document.getElementById("idProd").select();
		
		
	}
	
	/*
	var prod = new objproducto(codigo, nombre, precio, imagen,0);
	arrProds.push(prod);
	
	console.log(arrProds);
	*/

}


function nuevaOrden(){
	document.getElementById("tablaProductosBody").innerHTML = "";
	document.getElementById("idOrden").value = "";
	document.getElementById("fechaE").value = "";
	document.getElementById("idProv").value ="" ;
	
	document.getElementById("idOrden").select();
	recientesItems = [];
	
}







