async function test() {
    try {
        const res = await fetch('http://localhost:3000/payment/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: '201',
                amount: 200,
                from: 'BDT',
                to: 'USD'
            })
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
