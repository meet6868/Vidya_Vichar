const express = require('express');
require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT,"10.42.0.33", () => {
  console.log(`Server running on port ${PORT}`);
});

