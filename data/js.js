const path = require(`path`);
const fs = require(`fs`);

fs.readFile(`cities_uk.csv`, `utf-8`, (err, data) => {
	if (err) throw err;

	const result = data
		.split(`\n`)
		.map((line) => {
			let [city, district, region, longitude, latitude] = line.split(`,`);

			if (district[0] !== `м`) {
				district = `${district} район`
			}

			if (region[0] !== `м`) {
				region = `${region} область`
			}

			return `${city},${district},${region},${longitude},${latitude},Україна`
		})
		.join(`\n`)

	fs.writeFile(`cities_uk.csv`, result, `utf-8`, (err) => {
		if (err) throw err;
		console.log(`yes`);
	});
})