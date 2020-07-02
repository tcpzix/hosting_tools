from flask import Flask, render_template, request
import json
import ipinfo
import subprocess
import socket
import requests


app = Flask(__name__)

@app.route('/')
def home():
    # get userr ip
    user_ip = request.remote_addr
    # get user ip location
    user_location = iplocation('217.218.8.250')
    return render_template('index.html', ip=user_ip ,location=user_location['city'])

# this is main api that return everything
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

    if 'whois' in tools:
        whois_record = whois(domain)
        result.update({'WHOIS': whois_record})

    if 'port scan' in tools:
        ports = portscan(domain)
        result.update({'PORTS' : ports})
        print('port scan runs.........')

    if 'ip' in tools:
        loc = iplocation(socket.gethostbyname(domain))
        result.update({'IPLOC' : loc})

    return json.dumps(result, indent=2)


# Scan common ports for host
def portscan(host):
    port_list = {80:"HTTP", 443:"HTTPS", 21:"FTP", 22:"SSH", 23:"TELNET", 25:"SMTP", 110:"POP3", 123:"NTP", 143:"IMAP", 2222:"DIRECTADMIN", 8443:"PLESK-HTTPS", 8880:"PLESK", 3306:"MYSQL", 1433:"MICROSOFT-SQL", 5432:"POSTGRE-SQL", 2083:"CPANEL"}
    result = {}
    for port in port_list:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        conn = s.connect_ex((host,port))
        if(conn == 0):
            result.update({port:port_list.get(port)})
        s.close
    return result          




# get ip Location wit ipinfo.io api
def iplocation(ip):
    token = 'f1959802f790e3'
    handler = ipinfo.getHandler(token)
    answer = handler.getDetails(ip)
    result = {
        'ip' : answer.ip,
        'country' : answer.country,
        "region" : answer.region,
        "city" : answer.city,
        'timezone' : answer.timezone
    }
    return result





def whois(domain):
    req = requests.get(f"https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_mHEbeZYigz4NO4pjtlEyPGKTJOB20&domainName={domain}&outputFormat=JSON")
    answer = req.json()
    # check domian for ir or not 
    if('ir' in domain):
        domain = answer['WhoisRecord']['domainName']
        owner = answer['WhoisRecord']['registryData']['technicalContact']['name']
        org = answer['WhoisRecord']['registryData']['administrativeContact']['organization']
        email = answer['WhoisRecord']['registryData']['technicalContact']['email']
        city = answer['WhoisRecord']['registryData']['administrativeContact']['city']
        ns = answer['WhoisRecord']['registryData']['nameServers']['hostNames']
        phone = answer['WhoisRecord']['registryData']['administrativeContact']['telephone']
        update_date = answer['WhoisRecord']['registryData']['updatedDate']
        expire_date = answer['WhoisRecord']['registryData']['expiresDate']
    else:
        domain = answer['WhoisRecord']['registryData']['domainName']
        owner = answer['WhoisRecord']['technicalContact']['name']
        org = answer['WhoisRecord']['administrativeContact']['organization']
        email = answer['WhoisRecord']['technicalContact']['email']
        city = answer['WhoisRecord']['administrativeContact']['city']
        ns = answer['WhoisRecord']['nameServers']['hostNames']
        phone = answer['WhoisRecord']['administrativeContact']['telephone']
        update_date = answer['WhoisRecord']['updatedDate']
        expire_date = answer['WhoisRecord']['expiresDate']
    result = {
        'domain' : domain,
        'owner' : owner,
        'org' : org,
        'email' : email,
        'city' : city,
        'ns' : ns,
        'phone' : phone,
        'update' : update_date,
        'expire' : expire_date

    }
    return result





# get domain dns record
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
        output = [x.replace('\t','').replace('\n','') for x in temp[4:]]

        result.update({ record[r]: output})
    return result



if __name__ == '__main__':
    app.run(debug=True)

