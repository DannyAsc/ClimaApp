require('dotenv').config();
const {
	inquirerMenu,
	pausa,
	leerInput,
	listarLugares,
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
	const busquedas = new Busquedas();
	let opt;
	do {
		opt = await inquirerMenu();

		switch (opt) {
			case 1:
				// Mostrar mensaje
				const termino = await leerInput('Ciudad: ');

				// Buscar los lugares
				const lugares = await busquedas.ciudad(termino);

				// Seleccionar el lugar
				const id = await listarLugares(lugares);
				if (id === '0') continue;
				const lugarSel = lugares.find((l) => l.id === id);

				// Guardar en DB
				busquedas.agregarHistorial(lugarSel.nombre);

				// CLima
				const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

				// Mosttrar resultados

				console.log('\nInformacion de la ciudad\n'.green);
				console.log(`Ciudad: ${lugarSel.nombre}`);
				console.log(`Lng: ${lugarSel.lng}`);
				console.log(`Lat: ${lugarSel.lat}`);
				console.log(`Temperatura: ${clima.temp}`);
				console.log(`Minima: ${clima.min}`);
				console.log(`Maxima: ${clima.max}`);
				console.log(`Cómo está el clima?: ${clima.desc}`);

				break;

			case 2:
				busquedas.historiaCapitalizado.forEach((lugar, i) => {
					const idx = `${i + 1}`.green;
					console.log(`${idx} ${lugar}`);
				});
				break;

			default:
				break;
		}

		if (opt !== 0) {
			await pausa();
		}
	} while (opt !== 0);
};

main();
