// ====== DATOS DE LA TIENDA (precios y características de ejemplo) ======
const WHATSAPP = "5490000000000"; // código de país + área + número, sin + ni espacios
const ENVIO = 1000000;            // monto desde el cual el envío es gratis
var API_URL = "";                 // dirección de tu función de pago, ej. "/api/crear-preferencia" (vacío = modo demostración)
const productos = [
  { id:"hoffen-roja", nombre:"Cocina Hoffen Classic", color:"Rojo", linea:"Hoffen", precio:689000, antes:null, plancha:false, nuevo:true, rating:4.8, res:126,
    fotos:["img/hoffen-roja-1.jpg","img/hoffen-roja-2.jpg"],
    desc:"Cocina a gas de 4 hornallas con horno y visor de vidrio. Perillas de giro suave y mesada de acero inoxidable.",
    specs:[["Hornallas","4"],["Medidas","50 x 60 cm"],["Horno","Con visor de vidrio"],["Encendido","Electrónico"]] },
  { id:"hoffen-negra", nombre:"Cocina Hoffen Classic", color:"Negro", linea:"Hoffen", precio:689000, antes:null, plancha:false, nuevo:false, rating:4.7, res:98,
    fotos:["img/hoffen-negra-1.jpg"],
    desc:"El mismo modelo Classic en negro: 4 hornallas, horno con visor de vidrio y detalles de acero inoxidable.",
    specs:[["Hornallas","4"],["Medidas","50 x 60 cm"],["Horno","Con visor de vidrio"],["Encendido","Electrónico"]] },
  { id:"hoffen-negra-plancha", nombre:"Cocina Hoffen Grill con plancha", color:"Negro", linea:"Hoffen", precio:749000, antes:829000, plancha:true, nuevo:false, rating:4.9, res:74,
    fotos:["img/hoffen-negra-plancha-1.jpg","img/hoffen-negra-plancha-2.jpg"],
    desc:"Plancha, hornallas, grill y horno con visor. Para cocinar de todo en un solo equipo.",
    specs:[["Hornallas","2 + plancha"],["Medidas","50 x 60 cm"],["Horno","Con visor y grill"],["Encendido","Electrónico"]] },
  { id:"inox-plancha", nombre:"Cocina Acero Plus con plancha", color:"Acero", linea:"Acero inoxidable", precio:899000, antes:null, plancha:true, nuevo:true, rating:4.6, res:52,
    fotos:["img/inox-plancha-1.jpg","img/inox-plancha-2.jpg"],
    desc:"Frente de acero inoxidable con plancha, hornallas, grill y horno con termómetro en la puerta.",
    specs:[["Hornallas","2 + plancha"],["Medidas","60 x 60 cm"],["Horno","Con termómetro"],["Encendido","Electrónico"]] },
  { id:"inox-grande", nombre:"Cocina Acero Pro 6 perillas", color:"Acero", linea:"Acero inoxidable", precio:1349000, antes:1499000, plancha:true, nuevo:false, rating:4.9, res:41,
    fotos:["img/inox-grande-1.jpg","img/inox-grande-2.jpg","img/inox-grande-3.jpg","img/inox-grande-4.jpg","img/inox-grande-5.jpg"],
    desc:"La más completa: 4 hornallas, plancha, grill y horno amplio con puerta de vidrio negro.",
    specs:[["Hornallas","4 + plancha"],["Medidas","90 x 60 cm"],["Horno","Amplio, puerta de vidrio"],["Encendido","Electrónico"]] }
];

if (typeof module !== "undefined") module.exports = { productos, ENVIO };
