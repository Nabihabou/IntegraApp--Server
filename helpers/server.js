var nodemailer = require('nodemailer');
var crypto = require('crypto');

module.exports = {
	sendmail: function(authData, data, to) {
		var transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: authData
		});
		var text = 'click em -> <a>localhost:8000/api/memo/confirmation?memo=' + data.url + " </a>";
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
}