
import workerize from 'workerize';
import Papaparse from "papaparse";

const origin=window.location.origin;
const worker = workerize(`
    export async function fetchCSV(url,options={}) {
      const {origin="${origin}", ...rest}=options;
      const response = await fetch(origin+url,rest);
      if (response.ok) {
        const csv = await response.text();
        return csv;
      }
    }
    export async function fetchJson(url,options={}) {
      const {origin="${origin}", ...rest}=options;
      const response = await fetch(origin+url,rest);
      if (response.ok) {
        const json = await response.json();
        return json;
      }
    }
`);
export const fetchCSV = async function(...args){
  const csv = await worker.fetchCSV(...args);
  const csvObj = Papaparse.parse(csv,{header: true});
  return csvObj.data;
}
export const fetchJson = worker.fetchJson;