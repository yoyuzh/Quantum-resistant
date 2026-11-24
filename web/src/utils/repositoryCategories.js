const categories = [
  ['crypto', '密码算法与基础库', [
    'legrandin/pycryptodome', 'open-quantum-safe/liboqs-python', 'openssl/openssl',
    'pyca/bcrypt', 'pyca/cryptography', 'pyca/pynacl', 'sybrenstuvel/python-rsa', 'tlsfuzzer/python-ecdsa',
    'antonkueltz/fastecdsa', 'backbone-hq/pqcrypto', 'data61/python-paillier', 'ecies/py', 'jhuisi/charm',
    'lc6chang/ecc-pycrypto', 'nillionnetwork/tinysig', 'syndace/python-xeddsa', 'tink-crypto/tink-py',
    'tprest/falcon.py', 'wbond/oscrypto',
  ]],
  ['identity', '身份认证与令牌', [
    'googleapis/google-auth-library-python', 'jpadilla/pyjwt', 'authlib/authlib', 'lepture/authlib',
    'mpdavis/python-jose', 'oauthlib/oauthlib', 'pallets/itsdangerous', 'pyauth/pyotp',
    'ahopkins/sanic-jwt', 'awslabs/stssamldriver', 'dajiaji/pyseto', 'fangli/django-saml2-auth', 'gehirninc/python-jwt',
    'hewlettpackard/jupyterhub-samlauthenticator', 'jazzband/djangorestframework-simplejwt',
    'jeremyschulman/netbox-plugin-auth-saml2', 'jpadilla/django-jwt-auth', 'labd/django-cognito-jwt',
    'mozilla/pyfxa', 'mx-moth/flask-saml2', 'penn-state-dance-marathon/python3-saml-django',
    'tcatshoek/fastapi-nextauth-jwt', 'techservicesillinois/awscli-login', 'viasat/alohomora',
    'vimalloc/flask-jwt-extended', 'zibasec/django-saml2-pro-auth',
  ]],
  ['tls', 'TLS 与证书', [
    'certifi/python-certifi', 'pyca/pyopenssl', 'pyca/service-identity', 'python-trio/trustme', 'tlsfuzzer/tlslite-ng',
    'gattjoe/ocspchecker', 'jkolezyn/cert_tree', 'leeclemens/check_x509_expire', 'mathiasertl/django-ca',
    'microsoft/did-x509', 'moebiussolutions/certs-installer', 'obfusk/x509_canonical_name.py',
    'rabbitmq/tls-gen', 'seanwrightsec/x509-parser', 'serverless-ca/terraform-aws-ca', 'tomtastic/tlsserial',
  ]],
  ['network', '网络客户端与协议', [
    'encode/httpx', 'paramiko/paramiko', 'psf/requests', 'rthalley/dnspython', 'urllib3/urllib3',
    'huashengdun/webssh', 'joaojacome/bitwarden-ssh-agent', 'pahaz/sshtunnel', 'plizonczyk/noiseprotocol',
  ]],
  ['formats', '密钥与数据格式', [
    'hynek/pem', 'pyasn1/pyasn1', 'wbond/asn1crypto', 'ethereum/eth-keyfile', 'identitypython/pyeleven',
    'kurtbrose/pyjks', 'msetina/pkcs11-card-management', 'msetina/pkcs11-cryptography-keys', 'p11-glue/pkcs11-json',
    'yubico/yubikey-manager',
  ]],
  ['messages', '消息加密与签名', [
    'python-otr/pure-python-otr', 'securityinnovation/pgpy', 'ethereum/eth-account', 'ethereum/eth-keys',
    'm32/endesive', 'opentimestamps/opentimestamps-client', 'secure-systems-lab/securesystemslib',
    'syndace/python-doubleratchet', 'the-a7k/akr-digital-signatures',
  ]],
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
