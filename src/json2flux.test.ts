import fluxQueryComplex from './flux-query-complex.json';
import fluxQuerySimple from './flux-query-simple.json';
import fluxQuery from './flux-query.json';
import json2flux, { FluxJsonQuery } from './json2flux';

test('It should return correct flux query', () => {
  expect(json2flux(fluxQuery as FluxJsonQuery)).toStrictEqual(`from(bucket: "mainflux_1h")
  |> range(start: -7d)
  |> filter(fn: (r) => r["building"] == "mock-building")
  |> filter(fn: (r) => r["_measurement"] == "CO2")
  |> filter(fn: (r) => r["device"] == "Air-Quality-Sensor")
  |> filter(fn: (r) => r["_field"] == "value")`);
});

test('It should return correct complex flux query', () => {
  expect(json2flux(fluxQueryComplex as FluxJsonQuery)).toStrictEqual(`from(bucket: "mainflux")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "ActiveEnergyTotal")
  |> filter(fn: (r) => r["_field"] == "value")
  |> filter(fn: (r) => r["level"] == "B1" or r["level"] == "B2" or r["level"] == "L10")
  |> group(columns: ["level"])
  |> aggregateWindow(every: 2m, fn: mean, createEmpty: false)
  |> yield(name: "mean")`);
});

test('It should return correct simple flux query', () => {
  expect(json2flux(fluxQuerySimple as FluxJsonQuery)).toStrictEqual(`from(bucket: "mainflux")
  |> range(start: -7d)
  |> filter(fn: (r) => r["_measurement"] == "ActiveEnergyTotal")
  |> filter(fn: (r) => r["_field"] == "value")
  |> filter(fn: (r) => r["level"] == "B1" or r["level"] == "B2" or r["level"] == "L10")
  |> group(columns: ["level"])
  |> aggregateWindow(every: 2m, fn: mean, createEmpty: false)
  |> yield(name: "mean")`);
});
