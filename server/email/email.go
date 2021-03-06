package email

import (
	"crypto/tls"
	"errors"
	"net/mail"
	"strconv"
	"strings"

	"gopkg.in/gomail.v2"

	log "github.com/Sirupsen/logrus"
	"github.com/matcornic/hermes"
)

type smtpAuthentication struct {
	Server         string
	Port           int
	Enabled        bool
	SenderEmail    string
	ServerEmail    string
	SenderIdentity string
	SMTPLogo       string
	SMTPUser       string
	SMTPPassword   string
}

var smtpConfig smtpAuthentication
var hermesConfig hermes.Hermes

// InitSMTPConfiguration initializes the SMTP configuration from the smtp.* parameters
func InitSMTPConfiguration(server, sender, user, smtpIdentity, smtpPassword, logo string) error {
	if server != "" {
		// SMTP server is configured, enabling it.
		smtpConfig.Enabled = true

		smtpStringTokens := strings.Split(server, ":")
		smtpConfig.Server = smtpStringTokens[0]
		portString := smtpStringTokens[1]

		port, err := strconv.Atoi(portString)
		if err != nil {
			log.Error("Port in smtp.server is not valid. Expected a number and obtained :", portString)
		}

		smtpConfig.Port = port

		if sender == "" {
			sender = user
		}

		smtpConfig.SenderEmail = sender
		smtpConfig.SenderIdentity = smtpIdentity

		if user != "" {
			// SMTP configuration defines user/password for SMTP authentication
			smtpConfig.SMTPUser = user
			smtpConfig.SMTPPassword = smtpPassword
		}

		smtpConfig.SMTPLogo = logo

		hermesConfig = hermes.Hermes{
			Theme: new(hermes.Flat),
			Product: hermes.Product{
				Name: "DAD",
				Logo: logo,
			},
		}
	}
	return nil
}

func recipientsAddress(adresses []mail.Address) []string {
	var recipients []string
	for _, addr := range adresses {
		recipients = append(recipients, addr.Address)
	}
	return recipients
}

func recipientsToString(adresses []mail.Address) []string {
	var recipients []string
	for _, addr := range adresses {
		recipients = append(recipients, addr.String())
	}
	return recipients
}

// SendOptions are options for sending an email
type SendOptions struct {
	To      []mail.Address
	ToCc    []mail.Address
	Subject string
	Body    hermes.Email
	Intros  []string
}

// Send sends the email
func Send(options SendOptions) error {

	if !smtpConfig.Enabled {
		return errors.New("Can't send email because SMTP is disabled. Please, add SMTP configuration. Check 'server --help' to configure")
	}

	from := mail.Address{
		Name:    smtpConfig.SenderIdentity,
		Address: smtpConfig.SenderEmail,
	}

	m := gomail.NewMessage()
	m.SetHeader("From", from.String())
	m.SetHeader("To", recipientsToString(options.To)...)
	m.SetHeader("Subject", options.Subject)
	m.SetHeader("Cc", recipientsToString(options.ToCc)...)

	emailBodyHTML, err := hermesConfig.GenerateHTML(options.Body)
	if err != nil {
		return err
	}

	// Generate the plaintext version of the e-mail (for clients that do not support xHTML)
	emailBodyPlainText, err := hermesConfig.GeneratePlainText(options.Body)
	if err != nil {
		return err
	}

	m.SetBody("text/plain", emailBodyPlainText)
	m.AddAlternative("text/html", emailBodyHTML)

	log.WithFields(log.Fields{
		"server":      smtpConfig.Server,
		"senderEmail": smtpConfig.SenderEmail,
		"recipient":   recipientsAddress(options.To),
	}).Info("SMTP server configuration")

	d := gomail.NewDialer(smtpConfig.Server, smtpConfig.Port, smtpConfig.SMTPUser, smtpConfig.SMTPPassword)

	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	return d.DialAndSend(m)
}
