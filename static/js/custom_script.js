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
    const domain = getInputValue('tools-check-input');
    const tools = getCheckboxesValue('tool-checkbox');

    if (tools.includes('whois'))
    {
       whois(domain);

   
    }

    url = 'tools_check';
    data = {
        'domain' : JSON.stringify(domain),
        'tools' : JSON.stringify(tools)
    }

    let sendData = ajaxPost(url, data);
    sendData.done(function(data) {
        console.log(data);

        document.getElementById('ns-record').innerHTML= data.DNS.NS;
        document.getElementById('mx-record').innerHTML = data.DNS.MX;
        document.getElementById('a-record').innerHTML = data.DNS.A;
        document.getElementById('soa-record').innerHTML = data.DNS.SOA;



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
 



// get whois data and show to the dom
function whois(domain) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        const answer = JSON.parse(this.responseText);
       let domainName,
        technicalContact,
        hostNames,
        updatedDate,
        expiresDate,
        administrativeContact
        // becuse of deffirent answer base on domain 
        if(domain.includes('ir'))
        {
            domainName = answer.WhoisRecord.domainName;
            technicalContact = answer.WhoisRecord.registryData.technicalContact;
            hostNames = answer.WhoisRecord.registryData.nameServers.hostNames;
            updatedDate = answer.WhoisRecord.registryData.updatedDate;
            expiresDate = answer.WhoisRecord.registryData.expiresDate;
            administrativeContact = answer.WhoisRecord.registryData.administrativeContact;
        } else {
            domainName = answer.WhoisRecord.registryData.domainName;
            technicalContact = answer.WhoisRecord.technicalContact;
            hostNames = answer.WhoisRecord.nameServers.hostNames;
            updatedDate = answer.WhoisRecord.updatedDate;
            expiresDate = answer.WhoisRecord.expiresDate;
            administrativeContact = answer.WhoisRecord.administrativeContact;
            
        }
        // inser data to the dom
        document.getElementById('whois-domain').innerHTML = domainName;
        document.getElementById('whois-update').innerHTML = updatedDate;
        document.getElementById('whois-expire').innerHTML = expiresDate;
        document.getElementById('whois-name').innerHTML = technicalContact.name;
        document.getElementById('whois-org').innerHTML = administrativeContact.organization;
        document.getElementById('whois-street').innerHTML = administrativeContact.street1;
        document.getElementById('whois-city').innerHTML = administrativeContact.city;
        document.getElementById('whois-email').innerHTML = technicalContact.email;
        document.getElementById('whois-phone').innerHTML = administrativeContact.telephone;
        document.getElementById('whois-ns').innerHTML = hostNames;
        }
    };
    // api url
    xhttp.open("GET", `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_mHEbeZYigz4NO4pjtlEyPGKTJOB20&domainName=${domain}&outputFormat=JSON`, true);
    xhttp.send();

}