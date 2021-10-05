# json2flux
A tool for converting json to flux query.


## Getting startted
```js
import json2flux from '@tuxmart/json2flux';



const jsonString = `
{
  "bucket": "mainflux_1h",
  "range": "-7d",
  "filters": [
    {
      "key": "building",
      "value": "mock-building",
      "operator": "eq"
    },
    {
      "key": "_measurement",
      "value": "CO2",
      "operator": "eq"
    },
    {
      "key": "device",
      "value": "Air-Quality-Sensor",
      "operator": "eq"
    },
    {
      "key": "_field",
      "value": "value",
      "operator": "eq"
    }
  ]
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
