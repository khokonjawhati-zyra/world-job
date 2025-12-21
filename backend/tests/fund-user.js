
async function fundUser() {
    console.log("Checking Balance...");
    try {
        const balRes = await global.fetch('http://localhost:3001/payment/balance/201').then(r => r.json());
        console.log("Current Balance:", balRes);

        if (balRes.balance < 5000) {
            console.log("Topping up...");
            const topUp = await global.fetch('http://localhost:3001/payment/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: '201', amount: 10000, currency: 'USD' })
            }).then(r => r.json());
            console.log("TopUp Result:", topUp);
        } else {
            console.log("Balance sufficient.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

fundUser();
