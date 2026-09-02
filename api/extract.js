// api/extract.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: "اسم العمل مطلوب" });
    }

    // رابط بث خام مباشر (HLS m3u8) مفتوح وسريع جداً ويعمل على جميع الهواتف
    return res.status(200).json({
        success: true,
        title: title,
        streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        format: "m3u8"
    });
}
