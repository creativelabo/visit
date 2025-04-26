const axios = require('axios');

exports.handler = async function(event, context) {
  // GoogleマップのURLとAPIキーのマッピング
  const urlMapping = {
    'geocode': 'https://maps.googleapis.com/maps/api/geocode/json',
    'directions': 'https://maps.googleapis.com/maps/api/directions/json',
    'distancematrix': 'https://maps.googleapis.com/maps/api/distancematrix/json'
  };

  try {
    // クエリパラメータからAPIタイプを取得
    const apiType = event.queryStringParameters.apiType;
    
    // 該当するAPIエンドポイントを取得
    const apiUrl = urlMapping[apiType];
    
    if (!apiUrl) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "サポートされていないAPIタイプです" }) 
      };
    }

    // リクエストパラメータをコピー
    const params = { ...event.queryStringParameters };
    
    // apiTypeパラメータを削除（実際のGoogleリクエストには不要）
    delete params.apiType;
    
    // Google Maps API キーを追加
    params.key = process.env.GOOGLE_MAPS_API_KEY;

    // Google Maps APIにリクエスト
    const response = await axios.get(apiUrl, {
      params: params
    });

    // 成功レスポンスを返す
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    // エラーハンドリング
    console.error('Google Maps API Error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Google Maps API呼び出しエラー",
        details: error.response?.data || error.message
      })
    };
  }
};
