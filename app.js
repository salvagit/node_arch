const express = require('express');
const http = require('http');

const app = new express();
const port = process.env.PORT || 5000;

const myserver = http.createServer(app);

const fs = require('fs');

let cantidad_tramos = 1;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/mustache.min.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/mustache/mustache.min.js');
});

app.get("/vuelos", (req, res) => {
	cantidad_tramos = parseInt(Math.random() * 5) + 1;
	console.log(cantidad_tramos);
	res.json(getCluster(template));
});

function getCluster(template) {

	var cluster = {

		id: parseInt(Math.random() * 1000),

		id_operador: 01,

		precio: {
			adulto: Math.random() * 100,
			menor: Math.random() * 10,
			moneda_id: 01,
		},

		impuestos: {
			impuesto: Math.random() * 3,
			tasa: Math.random() * 2,
			extras: Math.random() * 10
		},

		total: ()=>{
			let total_precios = cluster.precio.adulto +
								cluster.precio.menor;

			let total = total_precios + (total_precios *
										 cluster.impuestos.impuesto);

			return total * cluster.impuestos.tasa;
		},

		tramos: []
	};

	for (var i = 0; i < cantidad_tramos; i++) {
		cluster.tramos.push(getTramo(template, cluster));
	};

	return cluster;
}

function getTramo (template, cluster) {
	return {
		id: parseInt(Math.random() * 1000),
		cabina_tipo: 02,
		salida: {
			horario: new Date(),
			aeropuerto: getSalida(template,cluster)
		},
		llegada: {
			horario: new Date(),
			aeropuerto: getLlegada(template,cluster)
		}
	};
}

getSalida = (template, cluster) => {
	console.log(cluster);
	if (cluster.tramos.length === 0) {
		return template.origen;
	} else {
		let airs = aeropuertos.filter( (a)=> !(a==template.origen ||
											   a==template.destino) );
		let index = Math.floor(Math.random() * airs.length);
		return airs[index];
	}
};

getLlegada = (template, cluster) => {
	console.log(aeropuertos);
	if (cluster.tramos.length === cantidad_tramos-1) {
		return template.destino;
	} else {
		let index = Math.floor(Math.random() * aeropuertos.length);
		let a = aeropuertos[index];
		return a;
	}
};

const aeropuertos = ["EZE", "MIA", "BKK", "MDQ", "MDZ", "NQN", "CQC"];

const template = {
	origen: "EZE",
	destino: "MIA",
	precio: [1000,4000]
};

myserver.listen(port);
