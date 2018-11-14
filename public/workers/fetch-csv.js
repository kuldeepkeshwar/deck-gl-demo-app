function validate(response) {
  if (response.ok) {
    return response;
  } else {
    throw new Error("something went wrong!!");
  }
}
function flatten(arr,items){
  return arr.reduce((result,item)=>{
    return result.concat(...item);
  },items)
}

onmessage = function(e) {
  const { url, withHeaders = false,accumulatedSize=0 } = e.data;
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
          const accumulated=[];
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
                  if(accumulatedSize>0){
                    if(accumulated.length==accumulatedSize){
                      postMessage({ done: false, value:flatten(accumulated,json)  });
                      accumulated.length=0;
                    }else{
                      accumulated.push(json);
                    }
                  }else{
                    postMessage({ done: false, value: json });
                  }
                } else {
                  postMessage({ done: false, value: completeCells });
                }
              } else {
                if(accumulated.length>0){
                  postMessage({ done: false, value: flatten(accumulated,[]) });
                }
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
