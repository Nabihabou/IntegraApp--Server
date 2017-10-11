var nodemailer = require('nodemailer');
var crypto = require('crypto');
var request = require('request');

module.exports = {
	sendmail: function(authData, data, to) {
		var transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: authData
		});
		var text = 'click em -> <a>' + 'http://localhost:8080/#/integra/oficios/' + data.url +  '</a>';
		var mailOptions = {
			from: '"Tecnologia Niej" <no-reply@niejcesupa.org>',
			to: to,
			subject: 'Teste',
			text: 'Hello world?',
			html: text
		};
		console.log(text);
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			}
			console.log("Message sent: %s ", info );
		});
	},

	getId: function(token) {
		request.get('http://localhost:3000/tokendecode?token=' + token, function(err, response){
			var profileId = JSON.parse(response.body);
			return profileId;
		});
	}
}
