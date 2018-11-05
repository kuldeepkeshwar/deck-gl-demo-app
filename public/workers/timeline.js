onmessage = function(e) {
  console.log("Timeline-Worker: Message received from main script");
  const data=JSON.parse(e.data);
  let { records,currentYear, endYear } = data;
  const id = setInterval(function() {
    const data = records.filter(function(item) {
      const year = new Date(item.DateTime).getFullYear();
      return year <= endYear;
    });
    endYear++;
    const str=JSON.stringify({
      data,
      endYear
    })
    postMessage(str);
    if (currentYear <= endYear) {
      clearInterval(id);
    }
  }, 200);
};
