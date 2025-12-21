module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Determine path from query (passed by vercel rewrite)
    const { path } = req.query;
    const pathStr = Array.isArray(path) ? path.join('/') : (path || '');

    const backendBase = 'https://world-job-backend.vercel.app';
    const targetUrl = `${backendBase}/${pathStr}`;

    console.log(`[Proxy] Forwarding ${req.method} to ${targetUrl}`);

    try {
        const fetchOptions = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: (req.method !== 'GET' && req.method !== 'HEAD' && req.body) ? JSON.stringify(req.body) : undefined,
        };

        const response = await fetch(targetUrl, fetchOptions);

        // Forward status
        res.status(response.status);

        // Forward content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            res.json(data);
        } else {
            const data = await response.text();
            res.send(data);
        }
    } catch (error) {
        console.error("[Proxy Error]", error);
        res.status(500).json({ error: "Proxy Error", details: error.message });
    }
};
