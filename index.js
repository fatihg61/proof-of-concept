import * as dotenv from 'dotenv'
import express, { request, response } from 'express'

// Maak een nieuwe express app
const app = express()

dotenv.config()

// GET medewerkers
const url = "https://api.werktijden.nl/2/employees";

// GET inkloktijden
const punchesUrl ="https://api.werktijden.nl/2/timeclock/punches";

// POST inkloktijden
const clockinUrl ="https://api.werktijden.nl/2/timeclock/clockin";

// POST uitkloktijden
const clockoutUrl="https://api.werktijden.nl/2/timeclock/clockout";

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
//   console.log(request.query.employees);
  const employees = await dataFetch(url)
  const punches = await dataFetch(`https://api.werktijden.nl/2/timeclock/punches?departmentId=99173&start=2023-06-19&end=2023-06-20`)
  const clockedIn = punches.data.filter(pu => pu.type === 'clock_in')
  const clockedOut = punches.data.filter(pu => pu.type === 'clock_out')

  let mwArrayIn = []
  let mwArrayOut = []

  clockedIn.forEach(ci => {
	// Get all employees that are clocked in
	const medewerkers = employees.filter(em => em.id === ci.employee_id)
	const clockedInMw = medewerkers.find(mw => mw.id === ci.employee_id)

	mwArrayIn.push(clockedInMw)
})

clockedOut.forEach(ci => {
	// Get all employees that are clocked in
	const medewerkers = employees.filter(em => em.id === ci.employee_id)
	const clockedOutMw = medewerkers.find(mw => mw.id === ci.employee_id)

	mwArrayOut.push(clockedOutMw)
})

  console.log(punches);
//   dataFetch(url).then((data) => {
//     console.log(data)
//     response.render("index",{employee:data});
//   });
response.render("index", {employees, mwArrayIn, mwArrayOut})
});



// Inklokken

app.post("/inklokken", async (req, res) => {
	const departmentId = Number(req.body.department)
	const employeeId = Number(req.body.employee)

	const postData = {
		"employee_id": employeeId,
		"department_id": 99173,
	}

	postJson("https://api.werktijden.nl/2/timeclock/clockin", postData)
	res.redirect("/")
})

app.get("/inklokken", async (req, res) => {
	const departments = await dataFetch("https://api.werktijden.nl/2/departments")
	const employees = await dataFetch("https://api.werktijden.nl/2/employees")
	const punches = await dataFetch(`https://api.werktijden.nl/2/timeclock/punches?departmentId=99173&start=2023-06-19&end=2023-06-20`)

	const clockedOut = punches.data.filter(pu => pu.type === 'clock_out')

	let mwArrayOut = []

	clockedOut.forEach(ci => {
		// Get all employees that are clocked in
		const medewerkers = employees.filter(em => em.id === ci.employee_id)
		const clockedOutMw = medewerkers.find(mw => mw.id === ci.employee_id)
	
		mwArrayOut.push(clockedOutMw)
	})

  
	res.render("inklokken", {title:"Inklokken", departments, employees, mwArrayOut})
})

app.post("/uitklokken", async (req, res) => {
	const departmentId = Number(req.body.department)
	const employeeId = Number(req.body.employee)

	const postData = {
		"employee_id": employeeId,
		"department_id": 99173,
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