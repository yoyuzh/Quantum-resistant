const categories = [
  ['crypto', '密码算法与基础库', [
    'legrandin/pycryptodome', 'open-quantum-safe/liboqs-python', 'openssl/openssl',
    'pyca/bcrypt', 'pyca/cryptography', 'pyca/pynacl', 'sybrenstuvel/python-rsa', 'tlsfuzzer/python-ecdsa',
  ]],
  ['identity', '身份认证与令牌', [
    'googleapis/google-auth-library-python', 'jpadilla/pyjwt', 'authlib/authlib', 'lepture/authlib',
    'mpdavis/python-jose', 'oauthlib/oauthlib', 'pallets/itsdangerous', 'pyauth/pyotp',
  ]],
  ['tls', 'TLS 与证书', [
    'certifi/python-certifi', 'pyca/pyopenssl', 'pyca/service-identity', 'python-trio/trustme', 'tlsfuzzer/tlslite-ng',
  ]],
  ['network', '网络客户端与协议', [
    'encode/httpx', 'paramiko/paramiko', 'psf/requests', 'rthalley/dnspython', 'urllib3/urllib3',
  ]],
  ['formats', '密钥与数据格式', ['hynek/pem', 'pyasn1/pyasn1', 'wbond/asn1crypto']],
  ['messages', '消息加密与签名', ['python-otr/pure-python-otr', 'securityinnovation/pgpy']],
];
const known = new Map(categories.flatMap(([id, , names]) => names.map(name => [name, id])));
export const REPOSITORY_PAGE_SIZE = 30;

export function repositoryCategories(rows) {
  const groups = new Map([...categories, ['unclassified', '待分类']]
    .map(([id, label]) => [id, { id: 'category:' + id, label, rows: [] }]));
  for (const row of rows) {
    const id = known.get(row.repo.full_name.toLowerCase()) ?? 'unclassified';
    groups.get(id).rows.push(row);
  }
  return [...groups.values()].filter(group => group.rows.length);
}

export function categoryCounts(rows, status) {
  const totals = new Map();
  for (const row of rows) {
    for (const algorithm of row.algorithms) {
      const count = row.count(algorithm, status);
      if (count > 0) totals.set(algorithm, (totals.get(algorithm) || 0) + count);
    }
  }
  return totals;
}

export function categoryScale(groups, status) {
  return groups.reduce((max, group) => Math.max(max, ...categoryCounts(group.rows, status).values()), 1);
}
