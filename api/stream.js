export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id = '129', type = 'movie', s = 1, e = 1 } = req.query;

    const sources = [
        // سيرفر 1: محتوى آسيوي وأنمي
        {
            name: "Asian & Anime Core",
            url: type === 'movie' 
                ? `https://player.videasy.net/movie/${id}`
                : `https://player.videasy.net/tv/${id}/${s}/${e}`
        },
        // سيرفر 2: عالمي وهوليوود
        {
            name: "Global Prime",
            url: type === 'movie'
                ? `https://vidlink.pro/movie/${id}`
                : `https://vidlink.pro/tv/${id}/${s}/${e}`
        },
        // سيرفر 3: احتياطي شامل لسد النواقص
        {
            name: "Archive Fallback",
            url: type === 'movie'
                ? `https://player.autoembed.cc/embed/movie/${id}`
                : `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`
        }
    ];

    // فحص التوفر وتصفية التكرار تلقائياً
    for (const src of sources) {
        try {
            const check = await fetch(src.url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (check.ok) {
                return res.status(200).json({
                    success: true,
                    provider: src.name,
                    embedUrl: src.url
                });
            }
        } catch (err) {
            continue;
        }
    }

    return res.status(200).json({
        success: true,
        provider: sources[0].name,
        embedUrl: sources[0].url
    });
}
