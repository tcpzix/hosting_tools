// tools check Go button 
const Go = document.querySelector('#dosearch');


// Event Listeners
Go.addEventListener('click',()=>{toolsCheck()});


// called when need to get multi checkbox value and pass name of its
function getCheckboxesValue(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}


// Get text inputbox  value
function getInputValue(name) {
    const input = document.getElementById(name);
    value = input.value;
    return value;
}




// main func for tools 
function toolsCheck() {
    // get domain and tools checkboxes value
    let domain = getInputValue('tools-check-input');
    let tools = getCheckboxesValue('tool-checkbox');

        
    url = 'tools_check';
    data = {
        'domain' : JSON.stringify(domain),
        'tools' : JSON.stringify(tools)
        }

    let sendData = ajaxPost(url, data);
    sendData.done(function(data) {
        console.log(data);
        showData(data);

    });
    
}
 

// send ajax post req to server
function ajaxPost(url, data) {
    return $.ajax({
        url: window.origin+'/'+url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: 'POST',
        dataType : 'json'
    });
}
 





function showData(data)
{
    if(data.DNS !== undefined)
    {
        
        let ns = data.DNS.NS;
        let mx = data.DNS.MX;
        let a = data.DNS.A;
        let soa = data.DNS.SOA;
        for(let x in ns){document.getElementById("ns-record").innerHTML = ns[x]+"<br/>"}
        for(let x in mx){document.getElementById("mx-record").innerHTML = mx[x]+"<br/>"}
        for(let x in a){document.getElementById("a-record").innerHTML = a[x]+"<br/>"}
        for(let x in soa){document.getElementById("soa-record").innerHTML = soa[x]+"<br/>"}
    }

    if(data.WHOIS !== undefined)
    {
        document.getElementById('whois-city').innerHTML = data.WHOIS.city;
        document.getElementById('whois-org').innerHTML = data.WHOIS.org;
        document.getElementById('whois-phone').innerHTML = data.WHOIS.phone;
        document.getElementById('whois-ns').innerHTML = data.WHOIS.ns;
        document.getElementById('whois-name').innerHTML = data.WHOIS.owner;
        document.getElementById('whois-domain').innerHTML = data.WHOIS.domain;
        document.getElementById('whois-email').innerHTML = data.WHOIS.email;
        document.getElementById('whois-update').innerHTML = data.WHOIS.update;
        document.getElementById('whois-expire').innerHTML = data.WHOIS.expire;
    }

    if(data.IPLOC !== undefined)
    {
        document.getElementById('ip-ip').innerHTML = data.IPLOC.ip,
        document.getElementById('ip-country').innerHTML = data.IPLOC.country,
        document.getElementById('ip-region').innerHTML = data.IPLOC.region,
        document.getElementById('ip-city').innerHTML = data.IPLOC.city,
        document.getElementById('ip-timezone').innerHTML =  data.IPLOC.timezone
    }

    if(data.PORTS !== undefined)
    {
        let ports = data.PORTS
       
        document.getElementById('ports-output').innerHTML = Object.keys(ports) + "<br />" + Object.values(ports);

    }
   
} 











// function dns(domain,) {
    
//     let xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function(){
//         if (this.readyState == 4 && this.status == 200)
//         {
//             const answer = JSON.parse(this.responseText);
//             console.log(answer);
//         }
//     }
//     xhr.open("POST", window.origin+'/tools_check', true);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.setRequestHeader("Data-Type", "json");
//     xhr.send();
// }



// get whois data and show to the dom
// function whois(domain) {
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//         const answer = JSON.parse(this.responseText);
//         let domainName,
//         technicalContact,
//         hostNames,
//         updatedDate,
//         expiresDate,
//         administrativeContact
//         // becuse of deffirent answer base on domain 
//         if(domain.includes('ir'))
//         {
//             domainName = answer.WhoisRecord.domainName;
//             technicalContact = answer.WhoisRecord.registryData.technicalContact;
//             hostNames = answer.WhoisRecord.registryData.nameServers.hostNames;
//             updatedDate = answer.WhoisRecord.registryData.updatedDate;
//             expiresDate = answer.WhoisRecord.registryData.expiresDate;
//             administrativeContact = answer.WhoisRecord.registryData.administrativeContact;
//         } else {
//             domainName = answer.WhoisRecord.registryData.domainName;
//             technicalContact = answer.WhoisRecord.technicalContact;
//             hostNames = answer.WhoisRecord.nameServers.hostNames;
//             updatedDate = answer.WhoisRecord.updatedDate;
//             expiresDate = answer.WhoisRecord.expiresDate;
//             administrativeContact = answer.WhoisRecord.administrativeContact;
            
//         }
//         // inser data to the dom
//         document.getElementById('whois-domain').innerHTML = domainName;
//         document.getElementById('whois-update').innerHTML = updatedDate;
//         document.getElementById('whois-expire').innerHTML = expiresDate;
//         document.getElementById('whois-name').innerHTML = technicalContact.name;
//         document.getElementById('whois-org').innerHTML = administrativeContact.organization;
//         document.getElementById('whois-street').innerHTML = administrativeContact.street1;
//         document.getElementById('whois-city').innerHTML = administrativeContact.city;
//         document.getElementById('whois-email').innerHTML = technicalContact.email;
//         document.getElementById('whois-phone').innerHTML = administrativeContact.telephone;
//         document.getElementById('whois-ns').innerHTML = hostNames;
//         }
//     };
//     // api url
//     xhttp.open("GET", `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_mHEbeZYigz4NO4pjtlEyPGKTJOB20&domainName=${domain}&outputFormat=JSON`, true);
//     xhttp.send();

// }