
import workerize from 'workerize';
import Papaparse from "papaparse";

const worker = workerize(`
    export async function fetchCSV(url) {
      console.log("fetching:",url)
      const response = await fetch(url);
      if (response.ok) {
        const csv = await response.text();
        return csv;
      }
    }
    export async function fetchJson(url) {
      const response = await fetch(url);
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
export function extend(other_array=[],context) {
  other_array.forEach(function(v) {context.push(v)}, context);
  return context;
}
export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
export const fetchJson = worker.fetchJson;