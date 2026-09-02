// api/stream.js - خادم التوزيع وسد النواقص التلقائي
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id, type = 'movie', s = 1, e = 1 } = req.query;

    if (!id) return res.status(400).json({ error: "TMDB ID مطلوب" });

    // مصفوفة محركات السحب والتحقق
    const resolvers = [
        // محرك 1: مخصص للأعمال الآسيوية والتركي والأنمي
        async () => {
            const url = `https://vidsrc.stream/api/source/${id}`;
            const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!r.ok) return null;
            const data = await r.json();
            return data?.url ? { stream: data.url, provider: 'Asian/Anime Engine' } : null;
        },
        // محرك 2: مخصص للمحتوى العالمي الحديث
        async () => {
            const endpoint = type === 'movie'
                ? `https://api.consumet.org/movies/flixhq/watch?episodeId=${id}`
                : `https://api.consumet.org/movies/flixhq/watch?episodeId=${id}&season=${s}&episode=${e}`;
            const r = await fetch(endpoint);
            if (!r.ok) return null;
            const data = await r.json();
            const source = data.sources?.find(x => x.quality === 'auto') || data.sources?.[0];
            return source?.url ? { stream: source.url, subtitles: data.subtitles, provider: 'Global HD' } : null;
        },
        // محرك 3: الاحتياطي الشامل لسد أي نقص متبقٍ
        async () => {
            const r = await fetch(`https://embed.su/api/stream/${type}/${id}`);
            if (!r.ok) return null;
            const data = await r.json();
            return data?.stream ? { stream: data.stream, provider: 'Archive Core' } : null;
        }
    ];

    // تشغيل منطق التوزيع التكاملي:
    // يفحص المصادر بالترتيب؛ أول مصدر يحتوي على الملف يسحبه فوراً
    for (const resolve of resolvers) {
        try {
            const result = await resolve();
            if (result && result.stream) {
                return res.status(200).json({
                    success: true,
                    streamUrl: result.stream,
                    subtitles: result.subtitles || [],
                    activeProvider: result.provider
                });
            }
        } catch (err) {
            // المصدر لا يملك العمل أو تعطل؟ ينتقل للمصدر المكمل له فوراً دون مقاطعة
            continue;
        }
    }

    return res.status(404).json({ success: false, error: "العمل غير متوفر في جميع المصادر المدمجة." });
}
