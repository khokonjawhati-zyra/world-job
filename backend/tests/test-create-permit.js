// Native fetch is available in Node 18+

async function testCreatePermit() {
    console.log("Testing Create Permit...");
    const payload = {
        jobType: "FREELANCE",
        jobId: "105",
        buyerId: "201",
        workerId: "101",
        totalAmount: 50, // Small amount to ensure funds
        currency: "USD"
    };

    try {
        const res = await fetch('http://localhost:3001/work-permit/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", data);

    } catch (e) {
        console.error("Error:", e);
    }
}

testCreatePermit();
