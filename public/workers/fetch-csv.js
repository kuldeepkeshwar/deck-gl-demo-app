function validate(response) {
  if (response.ok) {
    return response;
  } else {
    throw new Error("something went wrong!!");
  }
}
onmessage = function(e) {
  const { url, withHeaders = false } = e.data;
  console.log("fetching:", url);
  fetch(url)
    .then(validate)
    .then(response => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialCell = "";
      new ReadableStream({
        start() {
          let headers = null;
          function push() {
            reader.read().then(({ done, value }) => {
              partialCell += decoder.decode(value || new Uint8Array(), {
                stream: !done
              });
              let cellBoundry = /\n/;
              let completeCells = partialCell.split(cellBoundry);
              if (!done) {
                partialCell = completeCells[completeCells.length - 1];
                completeCells = completeCells.slice(0, -1);
                if (withHeaders) {
                  if (!headers)
                    headers = completeCells.splice(0, 1)[0].split(",");
                  const json = completeCells.map(row => {
                    const cells = row.split(",");
                    const obj = {};
                    cells.forEach((cell, index) => {
                      obj[headers[index]] = cell;
                    });
                    return obj;
                  });
                  postMessage({ done: false, value: json });
                } else {
                  postMessage({ done: false, value: completeCells });
                }
              } else {
                postMessage({ done: true });
                return;
              }
              push();
            });
          }
          push();
        }
      });
    }).catch(({message,stack})=>{
      postMessage({ done: true ,error:{message,stack}})
    });
};
