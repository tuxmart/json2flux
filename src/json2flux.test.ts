import fluxQuery from './flux-query.json';
import json2flux, { FluxJsonQuery } from './json2flux';

test('It should return correct flux sql', () => {
  expect(json2flux(fluxQuery as FluxJsonQuery))
    .toEqual(`from(bucket: "mainflux_1h")
  |> range(start: -7d)
  |> filter(fn: (r) => r["building"] == "mock-building")
  |> filter(fn: (r) => r["_measurement"] == "CO2")
  |> filter(fn: (r) => r["device"] == "Air-Quality-Sensor")
  |> filter(fn: (r) => r["_field"] == "value")`);
});
