"use strict";

let salesforce = require('./salesforce'),
    messenger = require('./messenger'),
    formatter = require('./formatter');

exports.schedule_visit = (sender, values) => {
    salesforce.findProperties({id: values[1]}).then(properties => {
        messenger.send(formatter.formatAppointment(properties[0]), sender);
    });
};

// exports.contact_broker = (sender, values) => {
//     messenger.send({text: "Here is the broker information for this property"}, sender);
//     messenger.send(formatter.formatBroker(), sender);
// };

exports.contact_broker = (sender, values) => {
    let propertyId = values[1];

    console.log(values);
    salesforce.findProperty({id: propertyId}).then(properties => {

        let property = properties[0];
        console.log(property);
        salesforce.findBrokers({id: property.get("broker__c")}).then(brokers => {
            messenger.send({text: "Here is the broker information for this property"}, sender);
            messenger.send(formatter.formatBrokerInfo(brokers[0]), sender);
        });
    });    
};

exports.confirm_visit = (sender, values) => {
    messenger.send({text: `OK, your appointment is confirmed for ${values[2]}. ${values[1]}.`}, sender);
};

exports.contact_me = (sender, values) => {

    let propertyId = values[1];
    messenger.getUserInfo(sender).then(response => {
        salesforce.createCase(propertyId, response.first_name + " " + response.first_name, sender).then(() => {
            messenger.send({text: `Thanks for your interest, ${response.first_name}. I asked a broker to contact you asap.`}, sender);
        });
    });

};
