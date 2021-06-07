# BlockG

<h3>:construction: Entorno de trabajo:</h3>
<li>Instalamos <b>Node.js</b> y <b>Angular 8+</b></li> 
<h3>:books: Dependencias</h3>
<li>Instalamos librerías con: <b>npm install</b> en mobile_QR_app y backEnd-node</li>
<h3>:mag_right: Testing</h3>
<li>Lanzamos los tests con <b>Blablabla</b></li>
<h3>:rocket: Lanzamos el proyecto con:</h3>

<li>Para la versión móvil: <b>ng serve</b> en mobile_QR_app</li>
<li>Para el BackEnd: <b>node app.js</b> en backEnd-node</li>

<h3>Roadmap para lanzar prueba completa</h3>
<li>Ejecutamos e iniciamos una red Ethereum con Ganache</li>
<li>En REMIX copiamos el contenido del contrato qr.sol en el IDE y nos conectamos a Ganache mediante el puerto 7545 usando un WEB3 Provider</li>
<li>Compilamos el contrato</li>
<li>Desplegamos el contrato con los siguientes datos: "Villareal - Manchester United", "1621940291", "20"</li>
<li>En la parte del back end en el fichero app.js establecemos el address del contrato desplegado en la variable QRContract</li>
<li>En la variable platformMainAddr establecemos el address que haya desplegado el contrato</li>
<li>Llamamos a la peticion requestNewAccount pasandole el JSON como aparece en la documentacion de la funcion</li>
<li>Llamamos a la peticion getEventPrice para obtener el precio del evento</li>
<li>Llamamos a la peticion requestTicket pasandole el JSON como aparece en la documentacion de la funcion, a tener en cuenta que los datos de usuario sean los devueltos por la anterior peticion</li>
<li>Ya tendriamos una entrada comprada</li>

<h3>:blue_book: Diagrama del proyecto:</h3>

![alt text](https://github.com/JonanOribe/BlockG/blob/main/docs/BlockG.png?raw=true)




<li>Para la versión móvil: <b>ng serve</b> en mobile_QR_app</li>
<li>Para la versión móvil: Hay que generar un nuevo QR con la address del nuevo contrato del evento</li>
<li>Para el BackEnd: <b>node app.js</b> en backEnd-node</li>