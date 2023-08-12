import { ChangeEvent, useState } from "react";

interface CityQueryResponse {
  country: string;
  lat: string;
  // `local_names` (optional) contains `en` (optional) names.
  local_names?: { en?: string };
  lon: string;
  name: string;
  state: string;
}

const App = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedCities, setSearchedCities] = useState<
    CityQueryResponse[] | null
  >(null);

  const fetchCityQuery = (query: string) => {
    // API spec: https://openweathermap.org/api/geocoding-api
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${
        import.meta.env.VITE_WEATHER_API
      }`
    )
      .then((res) => res.json())
      .then((data: []) => {
        const parsedData = data.map((val: CityQueryResponse) => {
          const country = val.country;
          const state = val.state;

          let name = val.name;
          if (val.local_names && val.local_names.en) {
            name = val.local_names.en;
          }

          return {
            country: country,
            lat: val.lat,
            lon: val.lon,
            name: name,
            state: state,
          };
        });
        setSearchedCities(parsedData);
      })
      .catch((reason) => console.log("Check if the API is correct, " + reason));
  };

  const searchCityHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearchTerm(value);

    // fetch data only if 3 or more charecter entered
    if (value.length >= 3) {
      fetchCityQuery(value);
    }
  };

  const searchSubmitHandler = () => {
    console.log("its pressed");
  };

  return (
    <div className="flex mx-auto max-w-md flex-col">
      <label htmlFor="search__city">Enter City</label>
      <div>
        <input
          name="search__city"
          className="rounded-l border border-sky-300"
          type="text"
          value={searchTerm}
          onChange={searchCityHandler}
        />
        <button
          className="rounded-r border border-red-300"
          onClick={searchSubmitHandler}
        >
          Search
        </button>
        {searchedCities !== null
          ? searchedCities.map((data) => (
              <li key={Math.random()}>
                {data.name}-{data.state}-{data.country}-{data.lat}-{data.lon}
              </li>
            ))
          : ""}
      </div>
    </div>
  );
};

export default App;
