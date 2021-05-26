// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

/**
 *  El contrato Qr para Orange 5G.
 * 
 * Posibles errores que hay que corregir:
 *  - Cambiar algunos uint a uint8 ??
 *  - Es muy basico quiza falta algun metodo mas
 */
contract Qr {
    bool locked = false;
    
    /**
     * address del admin que ha desplegado el contrato.
     * El contrato lo despliega el admin.
     */
    address payable public admin;
    
    /// Nombre de la evento
    string public nombre;
    
    // Fecha
    uint public fecha;
    
    
    // Precio
    uint public cost;
    
    /**
     * Datos de una Evento.
     
    struct Evento {
        string nombre;
        uint fecha;
        uint cost;
        
    }
    
    
    /// Eventos.
    Evento[] public eventos;
*/

    /// Datos de un Asistente.
    struct Asistente {
        string nombre;
        string email;
    }
    
    
    /// Acceder a los datos de un asistente dada su direccion.
    mapping (address  => Asistente) public asistente;
    
    
    // Array con las direcciones de los asistentes.
    address payable[] public asistentes;
    
    
    /// Tipos de acceso: presente, presente con permisos y admin.
    enum TipoAsistente { pres, perm, admin }
    
   
    /**
     * Constructor.
     * 
     * @param _nombre Nombre del evento.
     * @param _fecha  Fecha del evento.
     */
    constructor(string memory _nombre, uint  _fecha, uint _cost) {
        
        bytes memory bn = bytes(_nombre);
        require(bn.length != 0, "El nombre del evento no puede ser vacio");
        require(_fecha != 0, "La fecha del evento no puede estar vacio");
        require(_cost != 0 || _cost == 0, "El coste del evento no puede estar vacio");
      
        admin = payable(msg.sender);
        fecha = _fecha;
        nombre = _nombre;
        cost = _cost;
        
        
    }
    
      /**
     
   
    function creaEvento(string memory _nombre, uint _fecha, uint _cost) soloAdmin public returns (uint) {
        
        bytes memory bn = bytes(_nombre);
        require(bn.length != 0, "El nombre del evento no puede ser vacio");
        require(_fecha != 0, "la fecha del evento no puede estar vacio");
        require(_cost != 0 || _cost == 0, "El coste del evento no puede estar vacio");
        eventos.push(Evento(_nombre, _fecha, _cost));
        return eventos.length - 1;
    }
      */
 
     /**
     * El numero de  asistentes.
     *
     * @return El numero de asistentes.
     */
    function asistentesLength() public view returns(uint) {
        return asistentes.length;
    }
    
    
    /**
     * Los ususarios se apuntan a traves de este metodo.
     * 
     * Impedir que se pueda meter un nombre vacio.
     *
     * @param _nombre El nombre del asistente. 
     * @param _email  El email del asistente.
     */
    function compraEntrada(string memory _nombre, string memory _email) noAsistentes public payable {
        
        require(!locked, "Reentrant call detected!");
        locked = true;
        (bool success,) = admin.call{value: cost}("");
        require(success, "Failed to send Ether");
        locked = false;
        
        bytes memory b = bytes(_nombre); 
        require(b.length != 0, "El nombre no puede ser vacio");
        Asistente memory datos = Asistente(_nombre, _email);
        asistente[msg.sender] = datos;
        asistentes.push(msg.sender);
        
    }
    
    
   
    function whoAmI() soloAsistentes public view returns (string memory _nombre, string memory _email) {
        Asistente memory datos = asistente[msg.sender];
        _nombre = datos.nombre;
        _email = datos.email;
    }
    
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar alguien asistente.
     */
    function isIn(address assadd) private view returns (bool) {
      
        string memory _nombre = asistente[assadd].nombre;
        bytes memory b = bytes(_nombre);
        return b.length != 0;
    } 
   function getBalance( ) public view returns(uint256){
        return admin.balance;
    }
   
   
    modifier soloAdmin() {
        
        require(msg.sender == admin, "Solo permitido al admin");
        _;
    }
    
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar alguien asistente.
     */
    modifier soloAsistentes {
        
        require(isIn(msg.sender), "Solo permitido a asistentes");
        _;
    }
    
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar un no asistente.
     */
    modifier noAsistentes() {
        
        require(!isIn(msg.sender), "Solo permitido a no asistentes");
        _;
    }
    
   
    
    /**
     * No se permite la recepcion de dinero.
   
      */
    receive() external payable {
        revert("Se permite la recepcion de dinero.");
    }
    
}