// api/source.js
export default async function handler(req, res) {
    // استقبال معرّف الفيلم والنوع
    const { id, type = 'movie', season = 1, episode = 1 } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'TMDB ID is required' });
    }

    try {
        // الاتصال بمحرك استخراج الروابط المباشرة مفتوح المصدر
        // هذا المحرك يفك الشفرات في الخلفية ويعيد رابط الفيديو الخام
        const endpoint = type === 'tv' 
            ? `https://api.consumet.org/movies/flixhq/watch?episodeId=${id}&season=${season}&episode=${episode}`
            : `https://api.consumet.org/movies/flixhq/watch?episodeId=${id}`;

        // يمكن استخدام موفري استخراج مباشر متعددين مثل Videasy Extractor
        const response = await fetch(endpoint, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            // بديل احتياطي لاستخراج رابط مباشر نظيف عبر خادم استخراج مخصص
            const directBackup = `https://vidsrc.stream/api/source/${id}`;
            return res.status(200).json({
                success: true,
                streamUrl: directBackup,
                type: 'direct'
            });
        }

        const data = await response.json();
        
        // استخراج أعلى جودة متوفرة ورابط الـ m3u8 النظيف
        const sources = data.sources || [];
        const mainSource = sources.find(s => s.quality === 'auto') || sources[0];

        return res.status(200).json({
            success: true,
            streamUrl: mainSource?.url || null,
            subtitles: data.subtitles || []
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
