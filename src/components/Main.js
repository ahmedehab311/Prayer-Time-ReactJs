import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Prayer from "./Prayer";
import axios from "axios";

function Main() {
  const [data, setData] = useState(null);
  const [latitude, setLatitude] = useState(51.75865125);
  const [longitude, setLongitude] = useState(-1.25387785);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const fetchCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countriesData = response.data.map((country) => ({
        name: country.name.common,
        latitude: country.latlng[0],
        longitude: country.latlng[1],
      }));
      // console.log(countriesData);

      countriesData.sort((a, b) => a.name.localeCompare(b.name));

      setCountries(countriesData);
      // console.log(countriesData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const getTiming = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching prayer timings:", error);
    }
  };

  const handleCountryChange = (event) => {
    const country = countries.find((c) => c.name === event.target.value);
    if (country) {
      setLatitude(country.latitude);
      setLongitude(country.longitude);
      getTiming(country.latitude, country.longitude);
    }
    setSelectedCountry(event.target.value);
    // console.log(event.target.value)
  };

  useEffect(() => {
    fetchCountries();
    getTiming(latitude, longitude);
  }, [latitude, longitude]);

  if (!data) {
    return (
      <div className="loading">...Loading</div>
    );
  }

  return (
    <>
      <div
     
        // style={{
        //   marginTop: "20px",
        //   marginBottom: "20px",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        // }}
        className="container"
      >
         <div className="select-container">
        <select
        className="country-select"
          onChange={handleCountryChange}
          value={selectedCountry}
          // style={{
          //   padding: "10px",
          //   fontSize: "16px",
          //   border: "1px solid #ccc",
          //   borderRadius: "5px",
          //   width: "200px",
          //   backgroundColor: "#f8f8f8",
          //   cursor: "pointer",
          // }}
        >
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        </div>

      <Grid container>

        <Grid xs={6}>
        <div className="all">
        <div>
          <h1 className="place">Place: {data.meta.timezone}</h1>
        </div>
 
      </div>
        </Grid>
        <Grid xs={6}>
        <div>
          <h2 className="hijri-date">
            {data.date.hijri.day}  {data.date.hijri.month.ar}
           <span>  {data.date.hijri.year} </span>
          </h2>
         
        </div>
        <div>
        <h2 className="gregorian-date">
            {data.date.gregorian.weekday.en}. {data.date.gregorian.day}{" "}
            {data.date.gregorian.month.en}
          </h2>
        </div>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: "black", opacity: "0.1" }} />

      <Box style={{ display: "flex" }}>
        <Prayer name={"Fajr"} time={data.timings.Fajr} />
        <Prayer name={"Sunrise"} time={data.timings.Sunrise} />
        <Prayer name={"Dhuhr"} time={data.timings.Dhuhr} />
        <Prayer name={"Asr"} time={data.timings.Asr} />
        <Prayer name={"Maghrib"} time={data.timings.Maghrib} />
        <Prayer name={"Isha"} time={data.timings.Isha} />
      </Box>
      </div>
    </>
  );
}

export default Main;
