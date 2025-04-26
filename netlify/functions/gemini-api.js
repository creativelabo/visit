const axios = require('axios');

exports.handler = async function(event, context) {
  // POSTリクエストのみを許可
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    let requestBody;
    
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "無効なリクエスト形式です" }) 
      };
    }

    // Gemini APIキー（環境変数から取得）
    const apiKey = process.env.GEMINI_API_KEY;
    
    // APIエンドポイント
    const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    
    // リクエストを構築してGemini APIに送信
    const response = await axios.post(
      `${apiUrl}?key=${apiKey}`, 
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // 成功レスポンスを返す
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    // エラーハンドリング
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Gemini API呼び出しエラー",
        details: error.response?.data || error.message
      })
    };
  }
};
