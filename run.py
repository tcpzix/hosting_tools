from flask import Flask, render_template, request
import json
import dns.resolver
import subprocess

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('index.html')




@app.route('/tools_check', methods=['GET', 'POST'])
def runtools():
    data = request.get_json()
    # exclude " from string
    domain = data['domain'].strip('"')
    tools = data['tools']

    result = {}
    
    if 'dns' in tools:
        dnsrecords = dnscheck(domain)
        result.update({'DNS':dnsrecords})
    
    return result













def dnscheck(domain):
    # terminal command
    cmd = 'nslookup'
    # command switch's
    swch = '-type='
    record = ['NS', 'MX', 'A', 'SOA']
    result = {}
    for r in range(len(record)):
        answer = subprocess.Popen([cmd, swch+record[r], domain], bufsize=1, universal_newlines=True, stdout=subprocess.PIPE)
        temp = answer.stdout.readlines()
        # cut the \n and \t from text and show line 4 to end 
        output = [x.replace('\t',' ').replace('\n','') for x in temp[4:]]
        result.update({ record[r]: output})
    return result











if __name__ == '__main__':
    app.run(debug=True)

# domain = 'parspack.com'

# nameservers = dns.resolver.query(domain,'NS')
# arecord = dns.resolver.query(domain,'A')
# mx = dns.resolver.query(domain,'MX')
# soa = dns.resolver.query(domain,'SOA')

# for i in range(10):
# 	print('-')

# print('====NS====')
# for data in nameservers:

# 	print(data)


# print('====A Record====')
# for data in arecord:
# 	print(data)

# print('====MX====')

# for data in mx:
# 	print(data)

# print('====SOA====')
# for data in soa:
# 	prin(data)


# def get_records(domain):
#     """
#     Get all the records associated to domain parameter.
#     :param domain:
#     :return:
#     """
#     ids = [
#         'NONE',
#         'A',
#         'NS',
#         'MD',
#         'MF',
#         'CNAME',
#         'SOA',
#         'MB',
#         'MG',
#         'MR',
#         'NULL',
#         'WKS',
#         'PTR',
#         'HINFO',
#         'MINFO',
#         'MX',
#         'TXT',
#         'RP',
#         'AFSDB',
#         'X25',
#         'ISDN',
#         'RT',
#         'NSAP',
#         'NSAP-PTR',
#         'SIG',
#         'KEY',
#         'PX',
#         'GPOS',
#         'AAAA',
#         'LOC',
#         'NXT',
#         'SRV',
#         'NAPTR',
#         'KX',
#         'CERT',
#         'A6',
#         'DNAME',
#         'OPT',
#         'APL',
#         'DS',
#         'SSHFP',
#         'IPSECKEY',
#         'RRSIG',
#         'NSEC',
#         'DNSKEY',
#         'DHCID',
#         'NSEC3',
#         'NSEC3PARAM',
#         'TLSA',
#         'HIP',
#         'CDS',
#         'CDNSKEY',
#         'CSYNC',
#         'SPF',
#         'UNSPEC',
#         'EUI48',
#         'EUI64',
#         'TKEY',
#         'TSIG',
#         'IXFR',
#         'AXFR',
#         'MAILB',
#         'MAILA',
#         'ANY',
#         'URI',
#         'CAA',
#         'TA',
#         'DLV',
#     ]

#     for a in ids:
#         try:
#             answers = dns.resolver.query(domain, a)
#             for rdata in answers:
#                 print(a, ':', rdata.to_text())

#         except Exception as e:
#             print(e)  # or pass

# if __name__ == '__main__':
#     get_records('parspack.com')


# import dns.resolver
# import re

# domain = 'iran.ir'

# response = dns.resolver.resolve(domain, 'SOA')

# if response.rrset is not None:
#     pattern= r'(%s)\.\s(\d{1,})\s(\w+)\sSOA\s(.*?)\.\s(.*?)\.\s(\d{1,})\s(\d{1,})\s(\d{1,})\s(\d{1,})\s(\d{1,})' % domain
#     match = re.match(pattern, str(response.rrset))
#     m_name, ttl, class_, ns, email, serial, refresh, retry, expiry, minim = match.groups()

# output ='''
# Main Name In Zone: {a},
# Cache TTL: {b},
# Class: {c},
# Authoritive NS: {d},
# Email Address: {e},
# Last Change: {f},
# Retry In Secs: {g},
# Expiry: {h},
# Slave Cache In Sec: {i}
# '''.format(a = m_name, b = ttl, c = class_, d = ns, e = str(email).replace('\\', ''), f = serial, g = retry, h = expiry, i = minim)

# print (output)
