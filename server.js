const express = require("express");

const PORT = 5000;

const app = express();
const mongoose = require("mongoose");
const productRoutes = require("./routes");

mongoose
	.connect("mongodb://localhost:27017/tddapp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("mongoDB connect...."))
	.catch((err) => console.log(err));
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/products", productRoutes);

app.use((error, req, res, next) => {
	res.status(500).json({ message: error.message });
});

app.listen(PORT);
console.log(`Running on prot ${PORT}`);

module.exports = app;
