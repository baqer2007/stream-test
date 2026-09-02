// api/extract.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: "اسم العمل مطلوب للبحث" });
    }

    try {
        // 1. محاكاة استخراج رابط الفيديو المباشر المترجم
        // هنا يتم توجيه الاستعلام إلى نقطة البث الخام
        const searchUrl = `https://akwam.to/search?q=${encodeURIComponent(title)}`;
        
        // جلب صفحة العمل وقراءة رابط المشغل
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // في البداية نختبر استجابة السيرفر وتجهيز الرابط الخام
        return res.status(200).json({
            success: true,
            title: title,
            // رابط تجريبي مباشر بصيغة MP4 للتحقق من جاهزية المشغل لاستقبال البث الخام
            streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            format: "mp4"
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
