// Simulate the worker response
fetch('https://uki-dieta.lukasz-dudzinski.workers.dev', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        imageBase64: null,
        contextText: "Jesteś trenerem. Zrób test.",
        action: "chat"
    })
}).then(async r => {
    console.log(r.status);
    console.log(await r.text());
}).catch(e => console.error(e));
