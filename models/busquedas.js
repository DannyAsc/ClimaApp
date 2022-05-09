const fs = require('fs');
const axios = require('axios');

class Busquedas {
	historial = [];
	dbPath = './db/database.json';

	constructor() {
		// TODO: Leer DB si existe
		this.leerDB();
	}

	get historiaCapitalizado() {
		// Capitalizado
		return this.historial.map((historia) => {
			return historia.replace(/\w\S*/g, (txt) => {
				return txt.charAt(0).toUpperCase() + txt.substring(1);
			});
		});
	}

	get paramsMapbox() {
		return {
			access_token: process.env.MAPBOX_KEY,
			limit: 5,
			language: 'es',
		};
	}

	get paramsWeatherMap() {
		return {
			appid: process.env.OPENWEATHER_KEY,
			units: 'metric',
			lang: 'es',
		};
	}

	async ciudad(lugar = '') {
		try {
			// peticion http
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
				params: this.paramsMapbox,
			});
			const resp = await instance.get();
			return resp.data.features.map((lugar) => ({
				id: lugar.id,
				nombre: lugar.place_name,
				lng: lugar.center[0],
				lat: lugar.center[1],
			}));
		} catch (error) {
			return [];
		}
	}

	async climaLugar(lat, lon) {
		try {
			// Instance axios.create()
			const instance = axios.create({
				baseURL: 'https://api.openweathermap.org/data/2.5/weather',
				params: { ...this.paramsWeatherMap, lat, lon },
			});
			// resp.data
			const resp = await instance.get();
			// console.log(resp.data);

			return {
				desc: resp.data.weather[0].description,
				min: resp.data.main.temp_min,
				max: resp.data.main.temp_max,
				temp: resp.data.main.temp,
			};
		} catch (error) {
			console.log(error);
		}
	}

	agregarHistorial(lugar = '') {
		if (this.historial.includes(lugar.toLocaleLowerCase())) {
			return;
		}
		this.historial = this.historial.slice(0, 5);
		this.historial.unshift(lugar.toLocaleLowerCase());

		// Guardar en   DB
		this.guardarDB();
	}
	guardarDB() {
		const payload = {
			historial: this.historial,
		};
		fs.writeFileSync(this.dbPath, JSON.stringify(payload));
	}

	leerDB() {
		if (!fs.readFileSync(this.dbPath)) return;
		const { historial } = JSON.parse(
			fs.readFileSync(this.dbPath, { encoding: 'utf8' })
		);
		this.historial = historial;
	}
}

module.exports = Busquedas;
