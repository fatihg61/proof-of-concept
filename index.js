import * as dotenv from 'dotenv'
import express, { request, response } from 'express'

// Maak een nieuwe express app
const app = express()

dotenv.config()

const url = "https://api.werktijden.nl/2/employees";

const options = {
	method: "GET",
	headers: {
		Authorization: `Bearer ${process.env.API_KEY}`,
	}
}

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'));

// Stel afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Maak een route voor de index
app.get("/", async (request, response) => {
  console.log(request.query.employees);
  const data = await dataFetch(url)
  console.log(data);
//   dataFetch(url).then((data) => {
//     console.log(data)
//     response.render("index",{employee:data});
//   });
response.render("index", {data})
});

// inklok magic

app.post("/inklokken", async (req, res) => {
	const departmentId = Number(req.body.department)
	const employeeId = Number(req.body.employee)

	const postData = {
		"employee_id": employeeId,
		"department_id": departmentId,
	}

	postJson("https://api.werktijden.nl/2/timeclock/clockin", postData)
	res.redirect("/")
})

app.get("/inklokken", async (req, res) => {
	const departments = await dataFetch("https://api.werktijden.nl/2/departments")
	const employees = await dataFetch("https://api.werktijden.nl/2/employees")
  
	res.render("inklokken", {title:"Inklokken", departments, employees})
})

app.post("/uitklokken", async (req, res) => {
	const departmentId = Number(req.body.department)
	const employeeId = Number(req.body.employee)

	const postData = {
		"employee_id": employeeId,
		"department_id": departmentId,
	}

	postJson("https://api.werktijden.nl/2/timeclock/clockout", postData)
	res.redirect("/")
})

app.get("/uitklokken", async (req, res) => {
	const departments = await dataFetch("https://api.werktijden.nl/2/departments")
	const employees = await dataFetch("https://api.werktijden.nl/2/employees")

	res.render("uitklokken", {title:"Uitklokken", departments, employees})
})

// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}

async function dataFetch(url) {
	const data = await fetch(url, options)
		.then((response) => response.json())
		.catch((error) => error);
	return data;
}

async function postJson(url, body) {
	console.log(2, JSON.stringify(body));
	return await fetch(url, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		.then((response) => response.json())
		.catch((error) => error);
}