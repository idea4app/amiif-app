// const mailjet = require('node-mailjet').connect(
//   '3611bae8feb2d7600e0823610119208d',
//   '60fd1c5805283d940d2be9c081862f5c',
// )

// const notifyTypes = require('../contants/notify-types')

const emailsTo = [
  {
    Name: 'Oscar',
    Email: 'oscar.cardenasg@gmail.com',
  },
  // {
  //   Name: 'Fernando',
  //   Email: 'starla.frr@gmail.com',
  // },
  // {
  //   Name: 'Jonathan',
  //   Email: 'jan.merol@gmail.com',
  // },
]

const templateIds = {
  CONTRACT: 3745457,
  SHOPPING: 4120221,
}

export function emailNotifier({ notifyType, email, name, subject, variables }) {
  try {
    const templateId = templateIds[notifyType]
    const sendData = {
      Messages: [
        {
          To: emailsTo,
          Subject: subject,
          Variables: variables,
          TemplateID: templateId,
          TemplateLanguage: true,
          From: { Email: email, Name: name },
        },
      ],
    }

    console.log(JSON.stringify(sendData, null, 2))

    // const request = mailjet.post('send', { version: 'v3.1' }).request(sendData)
    // request
    //   .then(result => console.log(JSON.stringify(result.body, null, 2)))
    //   .then(console.log)
  } catch (error) {
    return false
  }
}
