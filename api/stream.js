// api/stream.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id, type = 'movie', s = '1', e = '1' } = req.query;

    if (!id) return res.status(400).json({ error: "Missing ID" });

    // مصفوفة المصادر المفحوصة
    const sources = [
        {
            name: "Videasy",
            url: type === 'movie' 
                ? `https://player.videasy.net/movie/${id}`
                : `https://player.videasy.net/tv/${id}/${s}/${e}`
        },
        {
            name: "VidLink",
            url: type === 'movie'
                ? `https://vidlink.pro/movie/${id}`
                : `https://vidlink.pro/tv/${id}/${s}/${e}`
        },
        {
            name: "Smashy",
            url: type === 'movie'
                ? `https://player.smashystream.xyz/movie/${id}`
                : `https://player.smashystream.xyz/tv/${id}?s=${s}&e=${e}`
        }
    ];

    // الفحص التلقائي: الباك إند يجرب المصادر بالترتيب ويعيد أول مصدر سليم
    for (const src of sources) {
        try {
            const check = await fetch(src.url, { 
                method: 'HEAD',
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            // إذا استجاب السيرفر بنجاح ولم يرجع 404 أو حظر
            if (check.ok && check.status !== 404) {
                return res.status(200).json({
                    success: true,
                    provider: src.name,
                    embedUrl: src.url
                });
            }
        } catch (err) {
            // في حال فشل الاتصال ينتقل للمصدر التالي فوراً
            continue;
        }
    }

    // إذا فشل الفحص السريع يرجع المصدر الأكثر شمولاً كخيار أخير
    return res.status(200).json({
        success: true,
        provider: "Fallback",
        embedUrl: sources[0].url
    });
}
