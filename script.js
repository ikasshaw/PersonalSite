let navBar = document.getElementById("myNavBar");
let apiKey = "BS7XPQOVRTZDGR0F";
let prices = [];
let labels = [];
let chartLabel = "";
let assetType = "";
let ticker = "";

navBar.innerHTML = `<div class="container-fluid">
<a class="navbar-brand" href="../../index.html">Isaac Shaw</a>
<button
    class="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
    aria-label="Toggle navigation"
>
    <span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link active" href="../../index.html">Home</a>
        </li>
        <!---
        <li class="nav-item">
            <a class="nav-link active" href="/pages/projects.html"
                >Projects</a
            >
        </li>

        --->

        <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Projects
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
          <li><a class="dropdown-item" href="/pages/projects.html">Past Projects</a></li>
          <li><a class="dropdown-item" href="/pages/stock-prices.html">Stock Prices Widget</a></li>
        </ul>
        </li>

        <li class="nav-item">
            <a class="nav-link" href="/pages/about.html"
                >About</a
            >
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/pages/contact.html">Contact</a>
        </li>
    </ul>
</div>
</div>`;

try {
	myChart.destroy();
} catch (error) {}

document
	.getElementById("tickerSubmit")
	.addEventListener("click", function (event) {
		event.preventDefault();
		const value = document.getElementById("tickerInput").value;
		if (value == "") {
			return;
		}
		getData(value);
	});

//On pressing enter on keyboard
document
	.getElementById("tickerInput")
	.addEventListener("keydown", function (event) {
		// console.log(event.code);
		if (event.code == "NumpadEnter" || event.code == "Enter") {
			event.preventDefault();

			document.getElementById("tickerSubmit").click();
		}
	});

function getData(value) {
	try {
		myChart.destroy();
	} catch (error) {}
	prices = [];
	labels = [];
	assetType = document.getElementById("asset-selector").value;
	ticker = document.getElementById("tickerInput").value;

	if (assetType == "stocks") {
		const url =
			"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
			ticker.toUpperCase() +
			"&interval=1min&apikey=" +
			apiKey;

		fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				console.log(json);
				chartLabel = json["Meta Data"]["2. Symbol"] + " Share Price";
				let responseData = json["Time Series (1min)"];
				let keys = Object.keys(responseData);

				for (let i = 0; i < keys.length; ++i) {
					prices.push(responseData[keys[i]]["4. close"]);
					labels.push(moment(keys[i]).format("h:mm a"));
				}

				updateChart(prices, labels);
			});
	} else {
		const url =
			"https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=" +
			ticker.toUpperCase() +
			"&market=USD&interval=1min&apikey=" +
			apiKey;

		fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				console.log(json);
				chartLabel =
					json["Meta Data"]["3. Digital Currency Name"] + " Token Price";
				let responseData = json["Time Series Crypto (1min)"];
				let keys = Object.keys(responseData);

				for (let i = 0; i < keys.length; ++i) {
					prices.push(responseData[keys[i]]["4. close"]);
					labels.push(moment(keys[i]).format("h:mm a"));
				}

				updateChart(prices, labels);
			});
	}
}

const ctx = document.getElementById("stockChart").getContext("2d");

Chart.defaults.size = 30;

function updateChart(price, labe) {
	const myChart = new Chart(ctx, {
		type: "line",

		data: {
			labels: labe,
			datasets: [
				{
					label: false,
					backgroundColor: "rgba(214, 73, 51, .325)",

					borderColor: "rgba(255, 99, 132, 1)",

					data: price,
					borderWidth: 0.5,
				},
			],
		},

		options: {
			responsive: true,
			title: {
				display: true,
				text: chartLabel,
			},

			aspectRatio: 1.5,
			legend: {
				display: false,
			},
			scales: {
				y: {
					min: 0,
					beginAtZero: true,
				},
				yAxes: {
					gridLines: {
						color: "rgba(0, 0, 0, 0)",
					},
				},

				xAxes: [
					{
						ticks: {
							display: false,
						},
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						},
					},
				],
			},
		},
	});
}
