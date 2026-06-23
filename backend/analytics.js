function getChannelAnalytics(token){
  return { ok: true, tokenExists: !!token };
}

module.exports = { getChannelAnalytics };