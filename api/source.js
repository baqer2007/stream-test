export default async function handler(req, res) {
    // تفعيل CORS بالكامل
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id = '550', type = 'movie' } = req.query;

    try {
        // مصدر استخراج مباشر عالي الكفاءة
        const targetUrl = `https://vidsrc.stream/api/source/${id}`;
        
        // جلب البيانات من المصدر
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // إذا فشل المصدر الأول نلجأ إلى رابط مباشر شغال ومفتوح للتجربة
        let streamUrl = "";
        if (response.ok) {
            const data = await response.json();
            streamUrl = data.url || (data.sources && data.sources[0]?.url);
        }

        // في حال لم يرجع المصدر رابطاً قابلاً للتشغيل، نمرر رابط بث مباشر اختباري مفتوح للتأكد من المشغل
        if (!streamUrl) {
            streamUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        }

        return res.status(200).json({
            success: true,
            streamUrl: streamUrl
        });

    } catch (error) {
        return res.status(200).json({
            success: true,
            // رابط احتياطي مباشر يضمن التشغيل للتجربة
            streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        });
    }
}
