# json2flux

A tool for converting json to flux query.

## Getting started

```js
import json2flux from '@tuxmart/json2flux';

const jsonString = `
{
  "from": "mainflux_1h",
  "range": "-7d",
  "building": "mock-building",
  "_measurement": "CO2",
  "device": "Air-Quality-Sensor",
  "_field": "value"
}
`;

json2flux(jsonString);
```

It will be converted into influx query.

```js
from(bucket: "mainflux_1h")
  |> range(start: -7d)
  |> filter(fn: (r) => r["building"] == "mock-building")
  |> filter(fn: (r) => r["_measurement"] == "CO2")
  |> filter(fn: (r) => r["device"] == "Air-Quality-Sensor")
  |> filter(fn: (r) => r["_field"] == "value")
```
