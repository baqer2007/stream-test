// api/extract.js - مستخرج روابط أكوام المباشرة
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: "اسم العمل مطلوب" });
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
    };

    try {
        // 1. البحث عن العمل داخل موقع أكوام
        const searchEndpoint = `https://akwam.to/search?q=${encodeURIComponent(title)}`;
        const searchRes = await fetch(searchEndpoint, { headers });
        const searchHtml = await searchRes.text();

        // استخراج رابط أول نتيجة بحث مطابقة
        const entryMatch = searchHtml.match(/href="(https:\/\/akwam\.to\/(movie|series)\/[^"]+)"/);

        if (!entryMatch || !entryMatch[1]) {
            return res.status(404).json({
                success: false,
                error: `لم يتم العثور على (${title}) في قاعدة بيانات أكوام.`
            });
        }

        const entryPageUrl = entryMatch[1];

        // 2. الدخول إلى صفحة العمل
        const pageRes = await fetch(entryPageUrl, { headers });
        const pageHtml = await pageRes.text();

        // البحث عن رابط زر المشاهدة أو التحميل المباشر
        const watchMatch = pageHtml.match(/href="(https:\/\/akwam\.to\/watch\/[^"]+)"/);
        const watchUrl = watchMatch ? watchMatch[1] : entryPageUrl;

        // 3. قراءة صفحة المشغل واستخراج مسار الفيديو الخام المباشر
        const watchRes = await fetch(watchUrl, { headers });
        const watchHtml = await watchRes.text();

        // استخراج وسم source أو رابط mp4 / m3u8 الخام
        const rawVideoMatch = watchHtml.match(/(https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*)/i) 
                           || watchHtml.match(/source\s+src="([^"]+)"/i);

        if (rawVideoMatch && rawVideoMatch[1]) {
            return res.status(200).json({
                success: true,
                title: title,
                sourcePage: entryPageUrl,
                streamUrl: rawVideoMatch[1],
                isDirect: true
            });
        }

        // في حال كانت السيرفرات تعتمد مشغل خارجي مباشر
        const iframeMatch = watchHtml.match(/<iframe[^>]+src="([^"]+)"/i);
        if (iframeMatch && iframeMatch[1]) {
            return res.status(200).json({
                success: true,
                title: title,
                sourcePage: entryPageUrl,
                streamUrl: iframeMatch[1],
                isDirect: false
            });
        }

        return res.status(404).json({
            success: false,
            error: "تم العثور على العمل ولكن تعذر فك تشفير رابط البث الخام."
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
